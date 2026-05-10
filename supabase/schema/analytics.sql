-- Analytics schema
-- Run this in Supabase SQL editor before enabling /api/views.

create extension if not exists pgcrypto;

-- ─── Page views (aggregate counter per slug) ────────────────────────────────
-- Used by: lib/services/analytics.ts, app/api/views/route.ts

create table if not exists public.page_views (
  slug  text        primary key,
  count bigint      not null default 0
);

alter table public.page_views enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'page_views'
      and policyname = 'page_views_read'
  ) then
    create policy page_views_read
      on public.page_views
      for select
      to anon, authenticated
      using (true);
  end if;
end
$$;

-- ─── Visitors (individual visit log with country) ───────────────────────────

create table if not exists public.visitors (
  id          uuid        primary key default gen_random_uuid(),
  slug        text        not null,
  ip_hash     text        not null,
  country     text,                       -- ISO 3166-1 alpha-2 (e.g. "FR", "US")
  user_agent  text,
  referrer    text,                       -- truncated Referer header (host or full URL)
  created_at  timestamptz not null default now()
);

-- Backfill for existing installations
alter table public.visitors
  add column if not exists referrer text;

create index if not exists visitors_slug_created_at_idx
  on public.visitors (slug, created_at desc);

create index if not exists visitors_ip_hash_slug_idx
  on public.visitors (ip_hash, slug);

create index if not exists visitors_country_idx
  on public.visitors (country)
  where country is not null;

create index if not exists visitors_referrer_idx
  on public.visitors (referrer)
  where referrer is not null;

alter table public.visitors enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'visitors'
      and policyname = 'visitors_read'
  ) then
    create policy visitors_read
      on public.visitors
      for select
      to anon, authenticated
      using (true);
  end if;
end
$$;

-- ─── Unique visitors (daily deduplicated view) ──────────────────────────────

create or replace view public.unique_visitors as
select
  slug,
  count(distinct ip_hash) as total,
  count(distinct ip_hash) filter (
    where created_at >= (current_date - interval '30 days')
  ) as last_30d,
  count(distinct ip_hash) filter (
    where created_at >= current_date
  ) as today
from public.visitors
group by slug;

-- ─── Country breakdown (aggregated view) ────────────────────────────────────

create or replace view public.visitor_countries as
select
  slug,
  country,
  count(distinct ip_hash) as unique_count,
  count(*)                as total_hits
from public.visitors
where country is not null
group by slug, country
order by unique_count desc;

-- ─── Atomic record_visit function ───────────────────────────────────────────
-- Inserts a visitor row and upserts the page_views counter in one call.
-- Returns whether this ip_hash was seen before for this slug (is_new = true
-- means first-ever visit from this hash on that slug).

-- Drop the previous 4-arg signature so the new 5-arg version doesn't end up
-- as a sibling overload. Safe to run repeatedly.
drop function if exists public.record_visit(text, text, text, text);

create or replace function public.record_visit(
  p_slug       text,
  p_ip_hash    text,
  p_country    text    default null,
  p_user_agent text    default null,
  p_referrer   text    default null
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_is_new boolean;
begin
  -- Check if this visitor is new for this slug
  select not exists(
    select 1 from public.visitors
    where ip_hash = p_ip_hash and slug = p_slug
    limit 1
  ) into v_is_new;

  -- Always log the visit
  insert into public.visitors (slug, ip_hash, country, user_agent, referrer)
  values (p_slug, p_ip_hash, p_country, p_user_agent, p_referrer);

  -- Increment the aggregate counter
  insert into public.page_views (slug, count)
  values (p_slug, 1)
  on conflict (slug)
  do update set count = page_views.count + 1;

  return jsonb_build_object('is_new', v_is_new);
end;
$$;

-- ─── Helpers: classify user agents and referrers ────────────────────────────
-- Edge MUST be checked before Chrome since Edge UA contains "Chrome".

create or replace function public.classify_browser(ua text)
returns text
language sql
immutable
as $$
  select case
    when ua is null then 'Unknown'
    when ua ~* 'edg(e|a|ios)?/' then 'Edge'
    when ua ~* 'opr/|opera/' then 'Opera'
    when ua ~* 'firefox/|fxios/' then 'Firefox'
    when ua ~* 'chrome/|crios/' then 'Chrome'
    when ua ~* 'safari/' then 'Safari'
    else 'Other'
  end;
$$;

create or replace function public.parse_referrer_host(ref text)
returns text
language sql
immutable
as $$
  select case
    when ref is null or ref = '' then null
    else lower(
      regexp_replace(
        regexp_replace(ref, '^https?://', '', 'i'),
        '/.*$', ''
      )
    )
  end;
$$;

-- ─── Browser breakdown view ─────────────────────────────────────────────────

create or replace view public.visitor_browsers as
select
  slug,
  public.classify_browser(user_agent) as browser,
  count(distinct ip_hash)              as unique_count,
  count(*)                              as total_hits
from public.visitors
where user_agent is not null
group by slug, public.classify_browser(user_agent)
order by unique_count desc;

-- ─── Referrer breakdown view (host-level) ───────────────────────────────────

create or replace view public.visitor_referrers as
select
  slug,
  public.parse_referrer_host(referrer) as host,
  count(distinct ip_hash)               as unique_count,
  count(*)                              as total_hits
from public.visitors
where referrer is not null
  and referrer <> ''
group by slug, public.parse_referrer_host(referrer)
order by unique_count desc;

-- ─── Top pages view (per slug, all time) ────────────────────────────────────

create or replace view public.top_pages as
select
  slug,
  count(distinct ip_hash) as unique_visitors,
  count(*)                 as total_hits
from public.visitors
group by slug
order by unique_visitors desc;

-- ─── Time-bounded RPCs ──────────────────────────────────────────────────────
-- p_days NULL or <=0 means "all time".

create or replace function public.get_unique_visitors_range(
  p_slug text,
  p_days int default null
)
returns table(total bigint, today_count bigint)
language sql
stable
as $$
  select
    count(distinct ip_hash) as total,
    count(distinct ip_hash) filter (where created_at >= current_date) as today_count
  from public.visitors
  where slug = p_slug
    and (
      p_days is null
      or p_days <= 0
      or created_at >= now() - make_interval(days => p_days)
    );
$$;

-- Site-wide unique visitors (across all slugs).
create or replace function public.get_unique_visitors_site_range(
  p_days int default null
)
returns table(total bigint, today_count bigint, last_30d bigint)
language sql
stable
as $$
  select
    count(distinct ip_hash) as total,
    count(distinct ip_hash) filter (where created_at >= current_date) as today_count,
    count(distinct ip_hash) filter (
      where created_at >= current_date - interval '30 days'
    ) as last_30d
  from public.visitors
  where (
    p_days is null
    or p_days <= 0
    or created_at >= now() - make_interval(days => p_days)
  );
$$;

create or replace function public.get_top_pages_range(
  p_days  int default null,
  p_limit int default 20
)
returns table(slug text, unique_visitors bigint, total_hits bigint)
language sql
stable
as $$
  select slug,
         count(distinct ip_hash) as unique_visitors,
         count(*)                 as total_hits
  from public.visitors
  where (
    p_days is null
    or p_days <= 0
    or created_at >= now() - make_interval(days => p_days)
  )
  group by slug
  order by unique_visitors desc
  limit p_limit;
$$;

-- Pass NULL slug to aggregate site-wide.
create or replace function public.get_visitor_countries_range(
  p_slug  text default null,
  p_days  int  default null,
  p_limit int  default 20
)
returns table(country text, unique_count bigint, total_hits bigint)
language sql
stable
as $$
  select country,
         count(distinct ip_hash) as unique_count,
         count(*)                 as total_hits
  from public.visitors
  where (p_slug is null or slug = p_slug)
    and country is not null
    and (
      p_days is null
      or p_days <= 0
      or created_at >= now() - make_interval(days => p_days)
    )
  group by country
  order by unique_count desc
  limit p_limit;
$$;

create or replace function public.get_visitor_browsers_range(
  p_slug  text default null,
  p_days  int  default null,
  p_limit int  default 10
)
returns table(browser text, unique_count bigint, total_hits bigint)
language sql
stable
as $$
  select public.classify_browser(user_agent) as browser,
         count(distinct ip_hash)              as unique_count,
         count(*)                              as total_hits
  from public.visitors
  where (p_slug is null or slug = p_slug)
    and user_agent is not null
    and (
      p_days is null
      or p_days <= 0
      or created_at >= now() - make_interval(days => p_days)
    )
  group by public.classify_browser(user_agent)
  order by unique_count desc
  limit p_limit;
$$;

create or replace function public.get_visitor_referrers_range(
  p_slug  text default null,
  p_days  int  default null,
  p_limit int  default 20
)
returns table(host text, unique_count bigint, total_hits bigint)
language sql
stable
as $$
  select public.parse_referrer_host(referrer) as host,
         count(distinct ip_hash)               as unique_count,
         count(*)                               as total_hits
  from public.visitors
  where (p_slug is null or slug = p_slug)
    and referrer is not null
    and referrer <> ''
    and (
      p_days is null
      or p_days <= 0
      or created_at >= now() - make_interval(days => p_days)
    )
  group by public.parse_referrer_host(referrer)
  order by unique_count desc
  limit p_limit;
$$;

-- Daily timeseries of unique + total visits over the last p_days days,
-- with zero-filled gaps. Pass NULL slug for site-wide aggregation.
create or replace function public.get_visitor_trend(
  p_slug text default null,
  p_days int  default 30
)
returns table(bucket date, unique_count bigint, total_hits bigint)
language sql
stable
as $$
  with series as (
    select generate_series(
      (current_date - make_interval(days => greatest(p_days, 1) - 1))::date,
      current_date,
      interval '1 day'
    )::date as bucket
  ),
  agg as (
    select created_at::date         as bucket,
           count(distinct ip_hash)  as unique_count,
           count(*)                  as total_hits
    from public.visitors
    where (p_slug is null or slug = p_slug)
      and created_at >= current_date - make_interval(days => greatest(p_days, 1) - 1)
    group by created_at::date
  )
  select s.bucket,
         coalesce(a.unique_count, 0) as unique_count,
         coalesce(a.total_hits, 0)   as total_hits
  from series s
  left join agg a on a.bucket = s.bucket
  order by s.bucket;
$$;

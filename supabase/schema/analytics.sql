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
  created_at  timestamptz not null default now()
);

create index if not exists visitors_slug_created_at_idx
  on public.visitors (slug, created_at desc);

create index if not exists visitors_ip_hash_slug_idx
  on public.visitors (ip_hash, slug);

create index if not exists visitors_country_idx
  on public.visitors (country)
  where country is not null;

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

create or replace function public.record_visit(
  p_slug       text,
  p_ip_hash    text,
  p_country    text    default null,
  p_user_agent text    default null
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
  insert into public.visitors (slug, ip_hash, country, user_agent)
  values (p_slug, p_ip_hash, p_country, p_user_agent);

  -- Increment the aggregate counter
  insert into public.page_views (slug, count)
  values (p_slug, 1)
  on conflict (slug)
  do update set count = page_views.count + 1;

  return jsonb_build_object('is_new', v_is_new);
end;
$$;

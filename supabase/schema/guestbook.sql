-- Guestbook schema
-- Run this in Supabase SQL editor before enabling /api/guestbook.

create extension if not exists pgcrypto;

create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 60),
  message text not null check (char_length(message) between 2 and 800),
  website text,
  approved boolean not null default true,
  country text,                       -- ISO 3166-1 alpha-2 (e.g. "FR", "US")
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists guestbook_entries_created_at_idx
  on public.guestbook_entries (created_at desc);

create index if not exists guestbook_entries_approved_created_at_idx
  on public.guestbook_entries (approved, created_at desc);

create index if not exists guestbook_entries_ip_hash_created_at_idx
  on public.guestbook_entries (ip_hash, created_at desc);

alter table public.guestbook_entries enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'guestbook_entries'
      and policyname = 'guestbook_read_approved'
  ) then
    create policy guestbook_read_approved
      on public.guestbook_entries
      for select
      to anon, authenticated
      using (approved = true);
  end if;
end
$$;


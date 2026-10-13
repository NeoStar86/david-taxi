-- Run in Supabase SQL Editor (enable Realtime for rides + settings in Dashboard → Database → Replication)

create table if not exists public.settings (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.rides (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;
alter table public.rides enable row level security;

-- Demo policies: allow anon read/write (tighten for production — e.g. service role + Edge Functions)
create policy "settings anon all" on public.settings for all using (true) with check (true);
create policy "rides anon all" on public.rides for all using (true) with check (true);

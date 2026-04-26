create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  slug text unique not null,
  name text not null,
  email text unique not null,
  role text not null check (role in ('buyer', 'creator', 'both')),
  category text,
  location text,
  bio text,
  verified boolean not null default false,
  verification_status text not null default 'pending'
    check (verification_status in ('pending', 'verified')),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

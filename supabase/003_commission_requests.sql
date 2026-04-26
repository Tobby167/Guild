create extension if not exists pgcrypto;

create table if not exists public.commission_requests (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles (id) on delete cascade,
  creator_slug text not null,
  creator_name text not null,
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  buyer_name text not null,
  buyer_email text not null,
  work_post_id uuid references public.work_posts (id) on delete set null,
  work_title text,
  project_title text not null,
  category text not null,
  budget_range text not null,
  needed_by text not null,
  description text not null,
  materials text,
  delivery_notes text,
  reference_notes text,
  status text not null default 'new'
    check (status in ('new', 'quoted', 'archived')),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.commission_requests enable row level security;

drop policy if exists "commission_requests_select_creator" on public.commission_requests;
create policy "commission_requests_select_creator"
on public.commission_requests
for select
to authenticated
using (auth.uid() = creator_id or auth.uid() = buyer_id);

drop policy if exists "commission_requests_insert_buyer" on public.commission_requests;
create policy "commission_requests_insert_buyer"
on public.commission_requests
for insert
to authenticated
with check (auth.uid() = buyer_id);

drop policy if exists "commission_requests_update_creator" on public.commission_requests;
create policy "commission_requests_update_creator"
on public.commission_requests
for update
to authenticated
using (auth.uid() = creator_id)
with check (auth.uid() = creator_id);

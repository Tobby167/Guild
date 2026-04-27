create extension if not exists pgcrypto;

create table if not exists public.work_posts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles (id) on delete cascade,
  creator_slug text not null,
  creator_name text not null,
  creator_verified boolean not null default false,
  title text not null,
  category text not null,
  format text not null check (format in ('Finished Piece', 'Work in Progress', 'Custom Example')),
  price_range text not null,
  lead_time text not null,
  commission_ready boolean not null default true,
  summary text not null,
  materials text[] not null default '{}',
  image_label text not null,
  image_path text,
  image_url text,
  image_data_url text,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.work_posts add column if not exists image_path text;
alter table public.work_posts add column if not exists image_url text;
alter table public.work_posts add column if not exists image_data_url text;

alter table public.work_posts enable row level security;

drop policy if exists "work_posts_select_public" on public.work_posts;
create policy "work_posts_select_public"
on public.work_posts
for select
to anon, authenticated
using (true);

drop policy if exists "work_posts_insert_own" on public.work_posts;
create policy "work_posts_insert_own"
on public.work_posts
for insert
to authenticated
with check (auth.uid() = creator_id);

drop policy if exists "work_posts_update_own" on public.work_posts;
create policy "work_posts_update_own"
on public.work_posts
for update
to authenticated
using (auth.uid() = creator_id)
with check (auth.uid() = creator_id);

drop policy if exists "work_posts_delete_own" on public.work_posts;
create policy "work_posts_delete_own"
on public.work_posts
for delete
to authenticated
using (auth.uid() = creator_id);

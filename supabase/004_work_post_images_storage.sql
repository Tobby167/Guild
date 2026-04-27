alter table public.work_posts add column if not exists image_path text;
alter table public.work_posts add column if not exists image_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'guild-work-images',
  'guild-work-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

drop policy if exists "work_images_public_read" on storage.objects;
create policy "work_images_public_read"
on storage.objects
for select
to public
using (bucket_id = 'guild-work-images');

drop policy if exists "work_images_insert_own" on storage.objects;
create policy "work_images_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'guild-work-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "work_images_update_own" on storage.objects;
create policy "work_images_update_own"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'guild-work-images'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'guild-work-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "work_images_delete_own" on storage.objects;
create policy "work_images_delete_own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'guild-work-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

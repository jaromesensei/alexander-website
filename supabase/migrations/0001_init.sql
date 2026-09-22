-- אלכסנדר | אתר ציבורי — סכמה ראשונית
-- מריצים דרך Supabase CLI: supabase db push
-- או מדביקים ב-SQL editor של הפרויקט.

-- הרחבות
create extension if not exists "pgcrypto";

-- ========== restaurant_settings (שורה יחידה) ==========
create table if not exists restaurant_settings (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'אלכסנדר',
  tagline text,
  about text,
  hero_image_url text,
  phone text not null default '',
  whatsapp text,
  email text,
  address text not null default '',
  map_url text,
  lat double precision,
  lng double precision,
  hours jsonb not null default '{}'::jsonb,
  instagram_url text,
  facebook_url text,
  updated_at timestamptz not null default now()
);

alter table restaurant_settings enable row level security;

create policy "settings_public_read" on restaurant_settings
  for select using (true);

create policy "settings_admin_write" on restaurant_settings
  for all to authenticated using (true) with check (true);

-- ========== menu_categories ==========
create table if not exists menu_categories (
  id uuid primary key default gen_random_uuid(),
  name_he text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table menu_categories enable row level security;

create policy "categories_public_read" on menu_categories
  for select using (is_active = true);

create policy "categories_admin_all" on menu_categories
  for all to authenticated using (true) with check (true);

-- ========== menu_items ==========
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references menu_categories(id) on delete cascade,
  name_he text not null,
  description_he text,
  price_agorot integer not null default 0,
  image_url text,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  tags text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists menu_items_category_id_idx on menu_items(category_id);

alter table menu_items enable row level security;

create policy "items_public_read" on menu_items
  for select using (is_available = true);

create policy "items_admin_all" on menu_items
  for all to authenticated using (true) with check (true);

-- ========== translation_cache ==========
-- נגיש רק דרך service_role (Route Handler), עוקף RLS. אין מדיניות ציבורית בכוונה.
create table if not exists translation_cache (
  id uuid primary key default gen_random_uuid(),
  lang text not null,
  source_hash text not null,
  source_text text not null,
  translated_text text not null,
  created_at timestamptz not null default now(),
  unique (lang, source_hash)
);

alter table translation_cache enable row level security;

-- ========== gallery_images ==========
create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption_he text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table gallery_images enable row level security;

create policy "gallery_public_read" on gallery_images
  for select using (true);

create policy "gallery_admin_all" on gallery_images
  for all to authenticated using (true) with check (true);

-- ========== Storage: public-media ==========
insert into storage.buckets (id, name, public)
values ('public-media', 'public-media', true)
on conflict (id) do nothing;

create policy "public_media_public_read" on storage.objects
  for select using (bucket_id = 'public-media');

create policy "public_media_admin_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'public-media');

create policy "public_media_admin_update" on storage.objects
  for update to authenticated using (bucket_id = 'public-media');

create policy "public_media_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'public-media');

-- ========== נתוני התחלה ==========
insert into restaurant_settings (name, tagline, address, phone, hours)
select
  'אלכסנדר',
  'דיינר משפחתי בלב נהריה',
  'רחוב הגעתון 12, נהריה',
  '04-1234567',
  '{
    "0": {"open": "12:00", "close": "22:00"},
    "1": {"open": "12:00", "close": "22:00"},
    "2": {"open": "12:00", "close": "22:00"},
    "3": {"open": "12:00", "close": "22:00"},
    "4": {"open": "12:00", "close": "23:00"},
    "5": {"open": "12:00", "close": "15:00"},
    "6": null
  }'::jsonb
where not exists (select 1 from restaurant_settings);

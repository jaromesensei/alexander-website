-- אלכסנדר | עמודים דינמיים (בלוקים) + תפריט ניווט ניתן לעריכה
-- מריצים דרך Supabase CLI: supabase db push
-- או מדביקים ב-SQL editor של הפרויקט.

-- ========== pages ==========
-- כל עמוד הוא רשימת בלוקים (jsonb) שנערכת בעורך הוויזואלי ב-/admin/pages.
-- העמוד עם slug = 'home' הוא עמוד הבית.
create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 60),
  title text not null,
  description text,
  blocks jsonb not null default '[]'::jsonb check (jsonb_typeof(blocks) = 'array'),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table pages enable row level security;

create policy "pages_public_read" on pages
  for select using (is_published = true);

create policy "pages_admin_all" on pages
  for all to authenticated using (true) with check (true);

-- ========== תפריט ניווט ==========
-- null = ברירת המחדל שבקוד. מערך של {label, href}.
alter table restaurant_settings
  add column if not exists nav_items jsonb;

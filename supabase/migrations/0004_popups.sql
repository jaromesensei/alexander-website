-- אלכסנדר | חלונות קופצים (פופאפים) לקידומים, עם תזמון לפי ימים, שעות ותאריכים
-- מריצים דרך Supabase CLI: supabase db push
-- או מדביקים ב-SQL editor של הפרויקט.

create table if not exists popups (
  id uuid primary key default gen_random_uuid(),
  -- שם פנימי לניהול בלבד
  name text not null default 'חלון קופץ',
  heading text not null default '',
  body text,
  image_url text,
  -- {label, href} או null
  button jsonb,
  bg text not null default 'paper'
    check (bg in ('paper', 'ink', 'pink', 'mustard', 'turquoise')),
  is_active boolean not null default false,
  -- ימים בשבוע: 0 = ראשון … 6 = שבת
  days smallint[] not null default '{0,1,2,3,4,5,6}',
  -- שעות לפי שעון ישראל. null = כל היום. start > end = חוצה חצות (למשל 22:00–02:00)
  start_time time,
  end_time time,
  -- טווח תאריכים (כולל). null = ללא הגבלה
  start_date date,
  end_date date,
  -- כמה פעמים מבקר רואה: session = בכל ביקור, day = פעם ביום, once = פעם אחת
  frequency text not null default 'day' check (frequency in ('session', 'day', 'once')),
  delay_seconds integer not null default 2 check (delay_seconds between 0 and 60),
  -- איפה מופיע: כל האתר / עמוד הבית / התפריט
  placement text not null default 'all' check (placement in ('all', 'home', 'menu')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table popups enable row level security;

create policy "popups_public_read" on popups
  for select using (is_active = true);

create policy "popups_admin_all" on popups
  for all to authenticated using (true) with check (true);

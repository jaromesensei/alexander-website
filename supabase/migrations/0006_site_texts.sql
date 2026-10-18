-- אלכסנדר | טקסטים קבועים באתר שניתנים לעריכה (כותרות עמודים, כפתורים, פוטר, הודעות וואטסאפ)
-- מריצים דרך Supabase CLI: supabase db push
-- או מדביקים ב-SQL editor של הפרויקט.

-- { "menu.title": "...", ... } — רק מה ששונה מברירת המחדל שבקוד (lib/siteTexts.ts)
alter table restaurant_settings
  add column if not exists site_texts jsonb;

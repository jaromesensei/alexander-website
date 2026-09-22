-- אלכסנדר | הוספת שדות "מבצע נוכחי" ל-restaurant_settings
-- מריצים דרך Supabase CLI: supabase db push
-- או מדביקים ב-SQL editor של הפרויקט.

alter table restaurant_settings
  add column if not exists promo_active boolean not null default false,
  add column if not exists promo_title text,
  add column if not exists promo_description text;

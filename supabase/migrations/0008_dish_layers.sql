-- אלכסנדר | שכבות מנה: בקרוסלת המנות בעמוד הבית, המנה שבמרכז "נפתחת" למרכיבים.
-- מריצים דרך Supabase CLI: supabase db push
-- או מדביקים ב-SQL editor של הפרויקט.

-- [{ "image_url": "...", "label": "לחמנייה" }, ...] — מהשכבה העליונה לתחתונה.
-- כל התמונות באותו גודל (ריבוע), רקע שקוף והמרכיב במרכז. null = תמונה רגילה.
alter table menu_items
  add column if not exists layers jsonb;

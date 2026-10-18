-- אלכסנדר | נגישות: פרטי הצהרת הנגישות + תיאור תמונה לחלונות קופצים
-- מריצים דרך Supabase CLI: supabase db push
-- או מדביקים ב-SQL editor של הפרויקט.

-- פרטי הצהרת הנגישות (תקנה 35 לתקנות הנגישות לשירות / ת"י 5568)
alter table restaurant_settings
  add column if not exists a11y_contact_name text,
  add column if not exists a11y_contact_phone text,
  add column if not exists a11y_contact_email text,
  -- הסדרי הנגישות הפיזיים במסעדה (כניסה, שירותים, חניה…)
  add column if not exists a11y_physical text,
  add column if not exists a11y_updated_on date;

-- תיאור לקוראי מסך לתמונת החלון הקופץ (חשוב במיוחד כשהתמונה היא פלייר עם טקסט)
alter table popups
  add column if not exists image_alt text;

-- אלכסנדר | פרטי תפריט: כמה מחירים למנה (גדלים) + הערה לכל קטגוריה
-- מריצים דרך Supabase CLI: supabase db push
-- או מדביקים ב-SQL editor של הפרויקט.

-- [{ "label": "120 גרם", "price_agorot": 3600 }, ...] — null = מחיר אחד (price_agorot)
alter table menu_items
  add column if not exists price_variants jsonb;

-- הערה שמוצגת מתחת לשם הקטגוריה (למשל "מוגשים בלחמנייה קלאסית או ללא גלוטן")
alter table menu_categories
  add column if not exists description_he text;

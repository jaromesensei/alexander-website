# הקמת Supabase — אתר אלכסנדר

## 1. יצירת פרויקט

1. [app.supabase.com](https://app.supabase.com) → New Project.
2. Project Settings → API → העתיקו `Project URL` ו-`anon public key` ל-`.env.local`
   (ראו `.env.example`).
3. Project Settings → API → `service_role key` → משתנה `SUPABASE_SERVICE_ROLE_KEY`
   (**שרת בלבד**, לעולם לא בקוד צד-לקוח).

## 2. הרצת המיגרציה

ב-SQL editor של הפרויקט, הדביקו והריצו את `supabase/migrations/0001_init.sql`
(או דרך ה-CLI: `supabase link` ואז `supabase db push`).

זה יוצר:

- `restaurant_settings`, `menu_categories`, `menu_items`, `gallery_images`,
  `translation_cache` — עם RLS מלא.
- Storage bucket ציבורי `public-media` להעלאת תמונות תפריט/גלריה/הירו.
- שורת ברירת מחדל ב-`restaurant_settings` (ניתן לעריכה מיידית ב-`/admin/settings`).

### מיגרציות נוספות (לפי הסדר)

כל קובץ ב-`supabase/migrations/` רץ פעם אחת, לפי המספר:

- `0002_promo_fields.sql` — שדות מבצע בהגדרות.
- `0003_pages_and_nav.sql` — טבלת `pages` לעורך העמודים הוויזואלי, ועמודת
  `nav_items` לתפריט הניווט. עד שהיא רצה האתר עובד עם עמוד הבית המקורי,
  אבל אי אפשר לשמור עמודים או ניווט.
- `0004_popups.sql` — טבלת `popups` לחלונות הקופצים המתוזמנים.
- `0005_accessibility.sql` — פרטי הצהרת הנגישות בהגדרות + תיאור תמונה לחלונות קופצים.
- `0006_site_texts.sql` — טקסטים קבועים באתר שניתנים לעריכה (מסך "טקסטים באתר").

## 3. יצירת משתמש מנהל

באתר הזה כל משתמש מחובר = מנהל (אין הבחנת תפקידים כמו במערכת הניהול הפנימית).
ליצירת המשתמש הראשון:

Authentication → Users → Add user → הזינו אימייל וסיסמה, **Auto Confirm User** מסומן.

התחברות: `/admin/login`.

**חשוב:** אחרי יצירת המשתמש — Authentication → Sign In / Providers → לכבות
את **Allow new users to sign up**. אחרת כל אחד יכול להירשם ולקבל הרשאות ניהול.

## 4. תרגום אוטומטי

התרגום החי (`/api/translate`) דורש `ANTHROPIC_API_KEY` בסביבת השרת (Vercel →
Project Settings → Environment Variables). בלי המפתח, האתר ימשיך לעבוד תקין
ופשוט יציג את התוכן בעברית בלבד.

## 5. פריסה (Vercel)

הוסיפו את כל משתני `.env.example` בהגדרות הפרויקט ב-Vercel (כולל
`NEXT_PUBLIC_SITE_URL` עם הדומיין הסופי) ובצעו Deploy.

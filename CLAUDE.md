# CLAUDE.md — מוסכמות פרויקט אתר אלכסנדר

אתר תדמית ציבורי למסעדת ההמבורגרים "אלכסנדר" בנהריה. פרויקט **נפרד** ממערכת
הניהול הפנימית (`AlexanderManager`) — קהל יעד שונה (לקוחות, לא צוות), דגש על
SEO ומהירות טעינה, Supabase נפרד משלו.

## מטרת האתר

דיינר משפחתי, אווירה חמה, עיצוב ברמה מקצועית. **התמקדות נוכחית: תפריט אונליין
עם תרגום אוטומטי לכל שפה + CMS פרטי לניהולו.** בלי הזמנת שולחן/הזמנה אונליין
בשלב זה — ראו `ROADMAP.md` פאזה 3 להרחבות עתידיות.

## סטאק טכני

| שכבה     | טכנולוגיה                                                         |
| -------- | ----------------------------------------------------------------- |
| Frontend | Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 |
| Backend  | Supabase — Postgres, Auth, Storage                                |
| תרגום    | Claude API (`@anthropic-ai/sdk`) דרך Route Handler, עם מטמון ב-DB |
| Deploy   | Vercel                                                            |

## מבנה תיקיות

```
src/
  app/
    page.tsx, menu/, gallery/, contact/   עמודים ציבוריים
    admin/login/                          כניסה
    admin/(dashboard)/                    CMS מוגן (layout עושה auth guard)
    api/translate/                        Route Handler לתרגום עם מטמון
  components/
    ui/       רכיבי design system בסיסיים (Button, Card, Input, Section)
    layout/   Header, Footer, LanguageSwitcher, ChromeGate (מסתיר chrome ב-/admin)
    home/     סקשנים של עמוד הבית
    menu/     כרטיס מנה, עמוד תפריט
    admin/    רכיבי ניהול (CRUD תפריט/גלריה/הגדרות)
  lib/
    data/     שכבת גישה ל-DB עם fallback לתוכן placeholder כשאין נתונים
    i18n/     LanguageProvider + useTranslations (תרגום חי בצד קליינט)
    supabase/ client.ts (דפדפן), server.ts (Server Components + service role)
  types/db.ts  טיפוסי DB
supabase/
  migrations/0001_init.sql   סכמה מלאה + RLS + Storage bucket
```

## הרשאות

משתמש מאומת אחד = מנהל (אין הבחנת תפקידים כמו במערכת הניהול הפנימית — כאן רק
הבעלים/צוות מורשה מנהלים תוכן). יצירת המשתמש נעשית ידנית ב-Supabase Dashboard
(ראו `supabase/README.md`). אכיפה: RLS ב-Postgres (מקור האמת) + guard ב-
`admin/(dashboard)/layout.tsx` (חוויית משתמש בלבד).

## תרגום תפריט

`useTranslations` (`lib/i18n/useTranslations.ts`) שולח ל-`/api/translate` רק
`{id, scope}` — הטקסט המקורי **נשלף מה-DB בצד שרת**, לא נשלח מהקליינט, כדי
שלא ניתן יהיה לנצל את ה-endpoint לתרגום טקסט שרירותי על חשבון מפתח ה-API.
תוצאות מתורגמות נשמרות ב-`translation_cache` (מפתח ייחודי `lang+source_hash`)
כך שכל טקסט מתורגם פעם אחת בלבד לכל שפה, לכל המבקרים.

## מוסכמות קוד

- **עברית RTL כברירת מחדל.** `dir="rtl"` ב-`<html>` (root layout). שדות
  אימייל/טלפון/סיסמה/מספרים — `dir="ltr"` נקודתי.
- **כסף = מספרים שלמים באגורות** (`price_agorot`). לעולם לא float. הצגה עם
  `formatCurrency` מ-`lib/format`.
- תאריכים דרך `Intl` בלוקאל `he-IL` (`formatDate`, `formatTime`).
- **סודות אף פעם לא בקוד צד-לקוח.** `service_role` ומפתח Claude — ב-Route
  Handlers עם `runtime = 'nodejs'` בלבד (`lib/supabase/server.ts#createServiceClient`).
- **כל טבלה עם RLS.** ללא יוצא מן הכלל (כולל `translation_cache`, שאין לה
  אפילו מדיניות — נגישה רק דרך service role).
- דפים ציבוריים שקוראים מ-DB תמיד עם fallback לתוכן placeholder
  (`lib/data/fallback.ts`) — האתר לא נשבר גם אם Supabase לא מוגדר עדיין.
- מיזוג מחלקות Tailwind עם `cn()`. רכיבי UI עם `forwardRef` ווריאנטים.
- Prettier: ללא נקודה-פסיק, גרשיים בודדים, רוחב 90.
- קומיטים קטנים וברורים, בעברית או אנגלית תמציתית.

## פקודות

```bash
npm run dev        # שרת פיתוח
npm run build      # build לפרודקשן
npm run start      # הרצת build פרודקשן
npm run lint       # ESLint
npm run typecheck  # בדיקת טיפוסים בלבד
npm run format     # Prettier
```

## הקמה מקומית

1. `npm install`
2. העתק `.env.example` ל-`.env.local` ומלא ערכי Supabase + `ANTHROPIC_API_KEY`
   אמיתיים.
3. הרץ את המיגרציה (ראה `supabase/README.md`).
4. `npm run dev`

## אופן העבודה

עובדים בפאזות עם צ'קפוינט לאישור בסוף כל אחת. ראה `ROADMAP.md` לסטטוס.
לפני החלטה ארכיטקטונית משמעותית — עוצרים ושואלים.

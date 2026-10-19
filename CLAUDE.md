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
    page.tsx, [slug]/                     עמוד הבית ועמודים דינמיים — מורכבים מבלוקים
    menu/, gallery/, contact/             עמודים קבועים
    admin/login/                          כניסה
    admin/(dashboard)/                    CMS מוגן (layout עושה auth guard)
    admin/(dashboard)/pages/              עורך עמודים ויזואלי + עריכת ניווט
    admin/preview/                        העמוד שנטען ב-iframe של העורך (postMessage)
    admin/(dashboard)/popups/             חלונות קופצים מתוזמנים
    admin/actions.ts                      publishContent — ניקוי מטמון אחרי שמירה
    api/translate/                        Route Handler לתרגום עם מטמון
  components/
    ui/       רכיבי design system בסיסיים (Button, Card, Input, Section)
    layout/   Header, Footer, LanguageSwitcher, ChromeGate (מסתיר chrome ב-/admin)
    blocks/   רכיבי הבלוקים (פתיח, טקסט, קריאה לפעולה…) + BlockRenderer
    menu/     כרטיס מנה, עמוד תפריט, תגיות מנה
    admin/    רכיבי ניהול; admin/editor/ = העורך הוויזואלי, admin/media/ = ספריית תמונות
    popups/   PopupCard + PopupManager (בוחר ומציג חלון לפי תזמון, בדפדפן)
  lib/
    blocks/   טיפוסי בלוקים, הגדרות שדות (defs.ts), ברירת המחדל של עמוד הבית
    data/     שכבת גישה ל-DB עם מטמון ו-fallback לתוכן placeholder
    menu/     הגדרות תגיות המנה (tags.ts)
    popups/   תזמון לפי שעון ישראל (schedule.ts) + זיכרון "כבר ראה" (seen.ts)
    links.ts  פתרון קישורים וטוקני פעולה (wa:reservation, tel, waze), ניווט ברירת מחדל
    i18n/     LanguageProvider + useTranslations (תרגום חי בצד קליינט)
    supabase/ client.ts (דפדפן), server.ts (Server Components + service role)
  types/db.ts  טיפוסי DB
supabase/
  migrations/0001_init.sql   סכמה מלאה + RLS + Storage bucket
  migrations/0003_pages_and_nav.sql   טבלת pages (בלוקים ב-jsonb) + nav_items
```

## עמודים ובלוקים

כל עמוד (כולל עמוד הבית, `slug = 'home'`) הוא מערך בלוקים ב-`pages.blocks`.
הטיפוסים ב-`lib/blocks/types.ts`; השדות שהעורך מציג לכל סוג ב-`lib/blocks/defs.ts`
(הטופס נבנה מהם אוטומטית). כדי להוסיף סוג בלוק: טיפוס → הגדרה ב-`BLOCK_DEFS` →
רכיב ב-`components/blocks/` → case ב-`BlockView`. צבעי רקע מוגבלים לצבעי המותג.

התצוגה המקדימה בעורך היא iframe של `/admin/preview` שמרנדר את אותם רכיבים —
כך ה-breakpoints אמיתיים והתצוגה זהה לאתר.

## טקסטים קבועים

כל טקסט ציבורי שאינו חלק מבלוק (כותרות העמודים הקבועים, כפתורים, פוטר, 404, הודעות
וואטסאפ) מוגדר ב-`lib/siteTexts.ts` עם ברירת מחדל, ונקרא דרך `siteText(settings, key)`.
**לא לכתוב טקסט ציבורי קבוע ישירות ב-JSX** — להוסיף מפתח ל-`SITE_TEXT_GROUPS` והוא
יופיע אוטומטית במסך "טקסטים באתר" (`/admin/texts`). קישורי וואטסאפ — `waHref()`.

## חלונות קופצים

טבלת `popups` (מיגרציה 0004). הדפים סטטיים, לכן **התזמון נבדק בדפדפן** ברגע
הכניסה (`PopupManager` + `lib/popups/schedule.ts`, תמיד לפי `Asia/Jerusalem`).
שעות שחוצות חצות שייכות ליום שבו הן מתחילות. "כבר ראה" נשמר ב-session/localStorage
עם `updated_at` במפתח — עריכת חלון מציגה אותו מחדש. אם כמה חלונות פעילים — העליון
ב-`sort_order` מוצג.

## נגישות (חובה חוקית — ת"י 5568 / WCAG AA)

האתר הציבורי חייב לעמוד בתקנה 35 לתקנות הנגישות לשירות (ת"י 5568, רמה AA).
כל שינוי ב-UI ציבורי חייב לשמור על:

- **ניגודיות:** פינק כרקע לטקסט לבן אסור (3.5:1). כפתורים/קישורים = `pink-dark`
  (5:1), hover = `pink-deep`. `pink` רק כרקע עם טקסט שחור.
- **פוקוס:** אסור `outline-none` ברכיב אינטראקטיבי ציבורי — טבעת הפוקוס הגלובלית
  ב-`globals.css` עובדת על כל רקע.
- **תמונות:** לכל תמונה אינפורמטיבית `alt` משמעותי; דקורטיבית — `alt=""`.
- **קישור שנפתח בכרטיסייה חדשה:** `ButtonLink` מוסיף לבד `NewTabHint`; ב-`<a>`/`<Link>`
  ידניים — להוסיף `<NewTabHint />`.
- **דיאלוגים:** פוקוס פנימה, Tab כלוא, Esc סוגר, פוקוס חוזר (ראו `PopupManager`).
- **אנימציה:** כניסות של עמוד (fade של `template.tsx`, הלוגו בפתיח) ב-CSS
  `@keyframes` ב-`globals.css`, לא ב-motion — רצות מהצביעה הראשונה ולא מסתירות תוכן
  עד שה-JS נטען. מצב הבסיס = המצב הסופי, והאנימציה רק תחת
  `prefers-reduced-motion: no-preference` (ו-`a11y-no-motion` מבטל). motion רק
  לאינטראקציות (חלון קופץ) ותמיד בתוך `SiteMotion`; transform כמחרוזת, יציאה מהירה
  מכניסה. בלי יותר מ-3 הבזקים בשנייה.
- **שפה:** תוכן מתורגם מסומן ב-`lang`/`dir` על המכיל שלו, לא על `<html>`.
- תפריט הנגישות (`components/a11y/AccessibilityMenu`) משלים — לא מחליף — את ההנגשה.
- הצהרת הנגישות: `/accessibility`, נבנית מההגדרות (איש קשר, הסדרים פיזיים, תאריך).
- בדיקה: axe-core דרך Playwright על כל העמודים (דסקטופ+מובייל) — יעד: 0 הפרות.

## מטמון ומהירות

הדפים הציבוריים קוראים ל-Supabase דרך קליינט בלי עוגיות (`lib/supabase/public.ts`)
עטוף ב-`unstable_cache` עם התג `content`, ולכן נבנים סטטית ומוגשים מה-CDN.
**כל שמירה בניהול חייבת לקרוא ל-`publishContent()`** (`app/admin/actions.ts`) —
אחרת השינוי לא יופיע באתר עד הריענון התקופתי (שעה). דפי הניהול קוראים ישירות,
בלי מטמון. תמונות מכווצות בדפדפן לפני העלאה (`lib/image/compress.ts`).

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

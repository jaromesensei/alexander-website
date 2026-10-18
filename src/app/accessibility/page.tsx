import type { Metadata } from 'next'
import { getSettings } from '@/lib/data/settings'
import { Section } from '@/components/ui/Section'
import { formatDate } from '@/lib/format'

export const metadata: Metadata = {
  title: 'הצהרת נגישות',
  description: 'הצהרת הנגישות של אתר אלכסנדר — התאמות הנגישות באתר ובמסעדה ודרכי פנייה.',
}

/** התאריך שבו בוצעה בדיקת הנגישות האחרונה של הקוד; הבעלים יכול לעדכן בהגדרות. */
const AUDIT_DATE = '2026-10-18'

export default async function AccessibilityPage() {
  const settings = await getSettings()
  const contactPhone = settings.a11y_contact_phone || settings.phone
  const contactEmail = settings.a11y_contact_email || settings.email
  const physical = (settings.a11y_physical ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  const updated = settings.a11y_updated_on || AUDIT_DATE

  return (
    <Section>
      <article className="max-w-3xl">
        <h1 className="text-4xl leading-tight sm:text-5xl">הצהרת נגישות</h1>
        <p className="text-ink-soft mt-4">עודכן לאחרונה: {formatDate(updated)}</p>

        <div className="mt-10 space-y-10 text-lg leading-relaxed [&_h2]:mb-3 [&_h2]:text-2xl [&_li]:ms-5 [&_li]:list-disc [&_ul]:space-y-1.5">
          <section aria-labelledby="a11y-intro">
            <h2 id="a11y-intro">מחויבות לנגישות</h2>
            <p>
              ב{settings.name} אנחנו רוצים שכל אחד ואחת יוכלו להכיר את המקום, לעיין בתפריט
              ולהגיע אלינו בקלות — כולל אנשים עם מוגבלות. האתר הונגש בהתאם לחוק שוויון
              זכויות לאנשים עם מוגבלות, התשנ&quot;ח-1998, לתקנות שוויון זכויות לאנשים עם
              מוגבלות (התאמות נגישות לשירות), התשע&quot;ג-2013, ולתקן הישראלי ת&quot;י
              5568 לנגישות תכנים באינטרנט ברמה AA, המבוסס על הנחיות WCAG של ארגון W3C.
            </p>
          </section>

          <section aria-labelledby="a11y-site">
            <h2 id="a11y-site">מה הונגש באתר</h2>
            <ul>
              <li>ניווט מלא באמצעות מקלדת, עם סימון ברור של הרכיב שבפוקוס.</li>
              <li>קישור &quot;דילוג לתוכן הראשי&quot; בתחילת כל עמוד.</li>
              <li>מבנה כותרות היררכי ואזורי ניווט מסומנים, לתמיכה בקוראי מסך.</li>
              <li>תיאור טקסטואלי (טקסט חלופי) לתמונות.</li>
              <li>ניגודיות צבעים העומדת בדרישות רמה AA.</li>
              <li>
                התאמה מלאה לטלפונים ולטאבלטים, ואפשרות להגדלת התצוגה עד 200% ללא אובדן
                תוכן.
              </li>
              <li>כיבוד הגדרת &quot;הפחתת תנועה&quot; של מערכת ההפעלה.</li>
              <li>הודעה לקוראי מסך על קישורים שנפתחים בכרטיסייה חדשה.</li>
              <li>
                תפריט נגישות (הכפתור בפינת המסך): הגדלת טקסט, ניגודיות גבוהה, הדגשת
                קישורים, גופן קריא ועצירת אנימציות.
              </li>
              <li>התפריט זמין בשפות רבות, והתוכן המתורגם מסומן בשפתו לקוראי מסך.</li>
            </ul>
            <p className="mt-3">
              האתר נבדק בדפדפנים Chrome,‏ Safari,‏ Firefox ו-Edge, ותומך בקוראי המסך NVDA
              ו-VoiceOver.
            </p>
          </section>

          <section aria-labelledby="a11y-limits">
            <h2 id="a11y-limits">הסתייגויות</h2>
            <p>
              אנחנו עושים מאמץ שכל התכנים באתר יהיו נגישים. ייתכן שיתגלו חלקים שטרם הונגשו
              במלואם או רכיבים של צד שלישי שאינם בשליטתנו — בין היתר מפת Google, ‏WhatsApp
              ו-Waze. התרגום לשפות זרות נעשה אוטומטית ועלול לכלול אי-דיוקים. אם נתקלתם
              בבעיה — נשמח שתספרו לנו ונטפל בה בהקדם.
            </p>
          </section>

          <section aria-labelledby="a11y-physical">
            <h2 id="a11y-physical">הסדרי נגישות במסעדה</h2>
            <p>
              {settings.name}, {settings.address}.
            </p>
            {physical.length > 0 ? (
              <ul className="mt-3">
                {physical.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3">
                לפרטים על הסדרי הנגישות במקום (כניסה, שירותים, חניה) ולתיאום התאמות — נשמח
                לעזור בטלפון או באימייל שלמטה.
              </p>
            )}
          </section>

          <section aria-labelledby="a11y-contact">
            <h2 id="a11y-contact">פנייה בנושא נגישות</h2>
            <p>
              נתקלתם בבעיית נגישות באתר או במסעדה? יש לכם הצעה לשיפור? נשמח לשמוע ונחזור
              אליכם בהקדם.
            </p>
            <dl className="mt-4 space-y-1">
              {settings.a11y_contact_name && (
                <div className="flex gap-3">
                  <dt className="text-ink-soft w-28 shrink-0">איש קשר</dt>
                  <dd>{settings.a11y_contact_name}</dd>
                </div>
              )}
              <div className="flex gap-3">
                <dt className="text-ink-soft w-28 shrink-0">טלפון</dt>
                <dd>
                  <a href={`tel:${contactPhone}`} className="underline" dir="ltr">
                    {contactPhone}
                  </a>
                </dd>
              </div>
              {contactEmail && (
                <div className="flex gap-3">
                  <dt className="text-ink-soft w-28 shrink-0">אימייל</dt>
                  <dd>
                    <a href={`mailto:${contactEmail}`} className="underline" dir="ltr">
                      {contactEmail}
                    </a>
                  </dd>
                </div>
              )}
              <div className="flex gap-3">
                <dt className="text-ink-soft w-28 shrink-0">כתובת</dt>
                <dd>{settings.address}</dd>
              </div>
            </dl>
          </section>
        </div>
      </article>
    </Section>
  )
}

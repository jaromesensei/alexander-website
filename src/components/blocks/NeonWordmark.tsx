const WORD = 'Alexander'
/** האות שמהבהבת כמו צינור ניאון עייף (ה-E השנייה) */
const FLICKER_INDEX = 7

/**
 * כניסת הלוגו: האותיות עולות אחת-אחת עם הטיה קלה שמתיישרת (כמו אותיות שנתלות על
 * שלט), ואז השלט "נדלק" בניאון ורוד ואות אחת מהבהבת — ומתייצב ללבן נקי.
 *
 * האנימציה כולה ב-CSS (globals.css, hero-*) ולא ב-JS: היא מתחילה מהצביעה הראשונה,
 * לא מחכה לטעינת React ולא נתקעת כשה-main thread עסוק.
 *
 * נגישות: מצב הבסיס הוא המצב הסופי, והאנימציות מוגדרות רק תחת
 * prefers-reduced-motion: no-preference, ו"עצירת אנימציות" בתפריט הנגישות מבטלת
 * אותן — אז הלוגו פשוט מופיע. ההבהוב מוגבל לאחד בזוהר ואחד באות — הרבה מתחת
 * ל-3 הבזקים בשנייה (WCAG 2.3.1).
 */
export function NeonWordmark() {
  return (
    // dir="ltr" חובה: כל אות היא inline-block, ובדף RTL הדפדפן היה מסדר אותן מימין לשמאל
    <span
      aria-hidden="true"
      dir="ltr"
      lang="en"
      className="hero-neon block whitespace-nowrap"
    >
      {[...WORD].map((letter, i) => (
        <span
          key={i}
          className="hero-letter inline-block"
          style={
            {
              '--i': i,
              '--tilt': i % 2 === 0 ? '-7deg' : '7deg',
            } as React.CSSProperties
          }
        >
          {i === FLICKER_INDEX ? (
            <span className="hero-flicker inline-block">{letter}</span>
          ) : (
            letter
          )}
        </span>
      ))}
    </span>
  )
}

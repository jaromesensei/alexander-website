/**
 * template.tsx נטען מחדש בכל ניווט (בניגוד ל-layout.tsx), ולכן ה-fade רץ בכל מעבר עמוד.
 * ה-fade ב-CSS (page-fade ב-globals.css) ולא ב-JS: כך הדף לא נשאר שקוף עד שה-React נטען.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-fade">{children}</div>
}

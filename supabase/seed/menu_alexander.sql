-- ============================================================
-- אלכסנדר | טעינת התפריט המלא (נוצר אוטומטית מתמלול התפריט המודפס)
-- מדביקים ב-Supabase: SQL Editor → New query → Run. בטוח להריץ — אם התפריט
-- כבר נטען, הסקריפט עוצר בלי לשנות כלום.
-- ============================================================

-- עמודות שהתפריט צריך (אם המיגרציות 0006/0007 עוד לא רצו)
alter table menu_items add column if not exists price_variants jsonb;
alter table menu_categories add column if not exists description_he text;
alter table restaurant_settings add column if not exists site_texts jsonb;

-- רוצים להתחיל נקי (למחוק מנות ניסיון שהוכנסו ידנית)? הסירו את ה-"--" מהשורה הבאה:
-- delete from menu_categories;

do $$
declare c uuid;
begin
  if exists (select 1 from menu_categories where name_he = 'המבורגרים') then
    raise exception 'התפריט כבר נטען (יש קטגוריה "המבורגרים"). כדי לטעון מחדש — מחקו קודם את הקטגוריות.';
  end if;

  -- נשנושים
  insert into menu_categories (name_he, description_he, sort_order, is_active)
    values ('נשנושים', null, 1, true) returning id into c;
  insert into menu_items
    (category_id, name_he, description_he, price_agorot, price_variants, sort_order, is_available, is_featured, tags)
  values
    (c, 'פוקאצ''ה איטלקית', 'נאפית בטאבון, עם מטבלי הבית.', 2100, null, 1, true, false, '{}'),
    (c, 'צ''יפס', null, 1800, '[{"label": "קטן", "price_agorot": 1800}, {"label": "גדול", "price_agorot": 3200}]'::jsonb, 2, true, false, '{}'),
    (c, 'צ''יפס פיקנטי', null, 1800, '[{"label": "קטן", "price_agorot": 1800}, {"label": "גדול", "price_agorot": 3200}]'::jsonb, 3, true, false, '{}'),
    (c, 'שעועית ירוקה עדינה מוקפצת', null, 1700, null, 4, true, false, '{}'),
    (c, 'סלט כפרי', 'חסה גסה, גזר, מלפפון ועגבניות שרי בתיבול שמן זית ולימון או ויניגרט.', 1700, '[{"label": "קטן", "price_agorot": 1700}, {"label": "גדול", "price_agorot": 4000}]'::jsonb, 5, true, false, '{}'),
    (c, 'סלט ירקות קצוץ', 'עגבנייה, מלפפון, חסה ופטרוזיליה בתיבול שמן זית ולימון.', 1700, '[{"label": "קטן", "price_agorot": 1700}, {"label": "גדול", "price_agorot": 4000}]'::jsonb, 6, true, false, '{}'),
    (c, 'פירה חלבי', null, 1700, null, 7, true, false, '{}'),
    (c, 'אורז', null, 1700, null, 8, true, false, '{}'),
    (c, 'מרק היום', 'בתקופות הקרות.', 2500, null, 9, true, false, '{}'),
    (c, 'צלחת חריפים', 'מיקס פלפלים, סחוג ושום קונפי — לאמיצים בלבד.', 1900, null, 10, true, false, '{}');

  -- ראשונות
  insert into menu_categories (name_he, description_he, sort_order, is_active)
    values ('ראשונות', null, 2, true) returning id into c;
  insert into menu_items
    (category_id, name_he, description_he, price_agorot, price_variants, sort_order, is_available, is_featured, tags)
  values
    (c, 'סלט עגבניות מרוקאי', 'עגבניות בלאדי, בצל סגול, שום, פטרוזיליה ופלפל ירוק חריף בתיבול שמן זית ולימון.', 2500, null, 1, true, false, '{}'),
    (c, 'הום פרייז', 'קוביות תפו"א מוקפצות עם צ''ילי מתוק ואהבה ♥', 3000, null, 2, true, false, '{}'),
    (c, 'טאבולה', 'מלא פטרוזיליה, בורגול, נענע, מלפפון וחמוציות, בתיבול שמן זית ולימון.', 3200, null, 3, true, false, '{}'),
    (c, 'צ''יפס בטטה מתוקהההה', 'מוגש עם סלסלת רטבים.', 3200, null, 4, true, false, '{}'),
    (c, 'טבעות בצל אמיתיות', 'הקראנץ'' הזה אמיתי?! מוגש עם צ''ילי מתוק.', 3200, null, 5, true, false, '{}'),
    (c, 'כרובית מצופה', 'קריספית עם צ''ילי מתוק.', 3700, null, 6, true, false, '{}'),
    (c, 'חציל מדורה', 'חציל שלם שרוף על הגריל, עם טחינה, פטרוזיליה ורוטב ירוק.', 3700, null, 7, true, false, '{}'),
    (c, 'פטה כבד', 'ממרח כבד עוף, מוגש עם ריבת בצל וטוסטונים.', 3700, null, 8, true, false, '{}'),
    (c, 'כנפיים לוהטות', 'חצאי כנפי עוף מוקפצות ברוטב סודי, עם קישוט של בצל ירוק.', 3700, null, 9, true, false, '{}'),
    (c, 'סיגרים של מאמא', 'ממולאים בבשר טחון פיקנטי וכל טוב, עם טחינה ורוטב ירוק.', 3700, null, 10, true, false, '{}'),
    (c, 'נקניקיות מרגז', 'שתי נקניקיות מרגז צלויות על הגריל, על מצע בצל מקורמל וחרדל.', 3700, null, 11, true, false, '{}'),
    (c, 'ברוסקטה אסאדו', 'אסאדו בבישול ארוך מוגש על טוסטונים חמים עם איולי שיפקה.', 4900, null, 12, true, false, '{}');

  -- המבורגרים
  insert into menu_categories (name_he, description_he, sort_order, is_active)
    values ('המבורגרים', '100% בשר בקר מובחר, טרי ועסיסי, הנטחן מדי יום ומעוצב בקפידה כדי להבטיח את הביס המושלם. ההמבורגרים מוגשים בלחמנייה קלאסית או ללא גלוטן, עם חסה, בצל סגול ומלפפון כבוש.', 3, true) returning id into c;
  insert into menu_items
    (category_id, name_he, description_he, price_agorot, price_variants, sort_order, is_available, is_featured, tags)
  values
    (c, 'אלכסנדר בורגר — ההמבורגר הדגל שלנו', 'עשוי מבשר בקר מובחר, טרי ועסיסי, הנטחן מדי יום ומעוצב בקפידה כדי להבטיח את הביס המושלם!', 3600, '[{"label": "120 גרם", "price_agorot": 3600}, {"label": "160 גרם", "price_agorot": 5000}, {"label": "220 גרם", "price_agorot": 5900}]'::jsonb, 1, true, false, '{}'),
    (c, 'קריספי צ''יקן', 'אין כמו שניצל עוף טרי וחם בלחמניית המבורגר, חסה, עגבנייה ומלפפון כבוש, על רוטב איולי שום. מוגש עם צ''יפס.', 6500, null, 2, true, false, '{}'),
    (c, 'צ''אק נוריס', '220 גר'' מבשר בקר עסיסי, חסה, מלפפון כבוש ובצל סגול, מוגש עם צ''יפס.', 7100, null, 3, true, false, '{}'),
    (c, 'ואן דאם', '220 גרם בשר טלה, חסה, מלפפון כבוש ובצל סגול, מוגש עם צ''יפס.', 7100, null, 4, true, false, '{}'),
    (c, 'סלופי ג''ו', 'בשר בקר עסיסי צרוב על הפלנצ''ה עם בצל מקורמל ברוטב BBQ, בתוך פרנה, חסה, מלפפון כבוש וטחינה, מוגש עם צ''יפס.', 7100, null, 5, true, false, '{}'),
    (c, 'רמבו', '220 גרם מנתח אנטריקוט עסיסי, חסה, מלפפון כבוש ובצל סגול, מוגש עם צ''יפס.', 7400, null, 6, true, false, '{}'),
    (c, 'ג''ניפר לופז', '220 גרם עסיסי במיוחד, מנתח אסאדו ושפונדרה על רוטב איולי-שיפקה, חסה, בצל סגול ומלפפון כבוש, מוגש עם צ''יפס וכתר טבעות בצל קריספיות.', 7400, null, 7, true, false, '{}'),
    (c, 'אנטוניו בנדרס', 'כריך בשר אסאדו מפורק בבישול ארוך, על רוטב איולי-שיפקה, חסה ומלפפון כבוש, עם ריבת בצל בצד, מוגש עם צ''יפס.', 7400, null, 8, true, false, '{}'),
    (c, 'מרלין מונרו', 'המבורגר? בפרנה? וואו! 220 גרם מבשר אנטריקוט עם ביצת עין, בצל מקורמל, חסה, מלפפון כבוש ובצל סגול. מוגש עם צ''יפס. (ניתן להחליף ללחמניית המבורגר קלאסית)', 7600, null, 9, true, false, '{}'),
    (c, 'ברוס לי', '300 גר'' מנתח אנטריקוט עסיסי, חסה, מלפפון כבוש, בצל סגול על רוטב איולי-שיפקה, מוגש עם צ''יפס.', 8100, null, 10, true, false, '{}'),
    (c, 'סמאש בורגר', '240 גרם — 2 קציצות מבשר אנטריקוט עסיסי, מעוכות וצרובות על הפלנצ''ה עם איולי חלפיניו, בצל מקורמל ואנטריקוט פרוס דק, בלחמנייה עם חסה, בצל סגול ומלפפון כבוש, מוגש עם צ''יפס.', 8100, null, 11, true, false, '{}'),
    (c, 'סופר סמאש בורגר', '240 גרם — 2 קציצות מבשר אנטריקוט עסיסי, מעוכות וצרובות על הפלנצ''ה עם איולי חלפיניו, צ''דר, בצל מקורמל וביצת עין, בלחמנייה עם חסה, בצל סגול ומלפפון כבוש, מוגש עם צ''יפס.', 8100, null, 12, true, false, '{}'),
    (c, 'ת"א-ניו יורק', '220 גרם מנתח אסאדו מעושן, עם אנטריקוט פרוס דק וביצת עין מלמעלה, חסה, בצל סגול ומלפפון כבוש על רוטב איולי שיפקה, מוגש עם צ''יפס.', 8200, null, 13, true, false, '{}'),
    (c, 'אמילי בפריז', '220 גרם מנתח אנטריקוט עסיסי, על רוטב איולי-שום, עם כתר של אסאדו וריבת בצל, חסה, בצל סגול ומלפפון כבוש, מוגש עם צ''יפס.', 8200, null, 14, true, false, '{}'),
    (c, 'שווארצנגר', '440 גרם של בשר בקר עסיסי, חסה, מלפפון כבוש, בצל סגול על רוטב איולי-שום, מוגש עם צ''יפס.', 8600, null, 15, true, false, '{}'),
    (c, 'טריפל סמאש', '3 קציצות מבשר אנטריקוט עסיסי, מעוכות וצרובות על הפלנצ''ה עם איולי חלפיניו, קונפי שום ובצל מקורמל, בלחמנייה עם חסה, בצל סגול ומלפפון כבוש, מוגש עם צ''יפס.', 9900, null, 16, true, false, '{}'),
    (c, 'אל פאצ''ינו', 'מוגזם, מרהיב ולאמיצים בלבד! מגדל של שלושה בורגרים — 660 גרם מנתח בקר עסיסי עם אנטריקוט פרוס דק ובצל מקורמל, מוגש עם צ''יפס.', 12900, null, 17, true, false, '{}'),
    (c, 'Sensational Burger', 'ההמבורגר הטבעוני שכבש את העולם. עשוי מחלבוני שעועית וסלק, מוגש בלחמנייה עם חסה, עגבנייה, בצל סגול ומלפפון חמוץ. מוגש עם צ''יפס.', 5900, '[{"label": "ללא תוספת", "price_agorot": 5900}, {"label": "עם תוספת", "price_agorot": 7300}]'::jsonb, 18, true, false, '{}');

  -- תוספות להמבורגר
  insert into menu_categories (name_he, description_he, sort_order, is_active)
    values ('תוספות להמבורגר', 'משהו טוב מעל הבורגר…', 4, true) returning id into c;
  insert into menu_items
    (category_id, name_he, description_he, price_agorot, price_variants, sort_order, is_available, is_featured, tags)
  values
    (c, 'בצל מטוגן / ריבת בצל / פלפל חריף / שום קונפי', null, 500, null, 1, true, false, '{}'),
    (c, 'גאודה / פטריות מוקפצות / ביצת עין', null, 700, null, 2, true, false, '{}'),
    (c, 'מוצרלה / גבינת צ''דר', null, 900, null, 3, true, false, '{}'),
    (c, 'אסאדו / אנטריקוט פרוס דק', null, 1200, null, 4, true, false, '{}');

  -- עיקריות
  insert into menu_categories (name_he, description_he, sort_order, is_active)
    values ('עיקריות', null, 5, true) returning id into c;
  insert into menu_items
    (category_id, name_he, description_he, price_agorot, price_variants, sort_order, is_available, is_featured, tags)
  values
    (c, 'שניצל אלכסנדר', 'קריספי, אגדי וכל הטוב שבעולם! מוגש עם צ''יפס ולימון.', 6200, null, 1, true, false, '{}'),
    (c, 'שקשוקה', 'ביצים מבושלות ברוטב עגבניות עשיר בתיבול ביתי, עגבניות טריות ופלפל חריף, בליווי פוקאצ''ה, סלט כפרי וטחינה.', 6200, null, 2, true, false, '{}'),
    (c, 'כנפיים לוהטות', 'אלף כבאים לא יצליחו לכבות אותן... כנפי עוף מטוגנות, מוקפצות ברוטב צ''ילי BBQ. בליווי צ''יפס.', 6200, null, 3, true, false, '{}'),
    (c, 'שניצלונים', 'כמו שניצל אבל חמודים יותר. קריספיים בטירוף, עם צ''יפס, צ''ילי מתוק ולימון.', 6200, null, 4, true, false, '{}'),
    (c, 'גריל צ''יקן', 'רצועות חזה עוף מוקפצות ברוטב סטיר-פריי עם פטריות, קוביות בטטה, בצל מקורמל ובצל ירוק. מוגש עם אורז.', 6200, null, 5, true, false, '{}'),
    (c, 'חזה רזה', 'חזה עוף על הגריל עם עגבניות שרי, שום קונפי, פלפל צ''ילי חריף, זיתי קלמטה, לימון ובזיליקום. מוגש עם אורז.', 6200, null, 6, true, false, '{}'),
    (c, 'חזה עוף על הגריל', 'על מצע שעועית ירוקה עדינה ופטריות מוקפצים בשום ושמן זית כתית. מוגש עם סלט כפרי.', 6200, null, 7, true, false, '{}'),
    (c, 'ראגו בולונזה', 'פסטה טרייה עם ראגו מבשר בקר מובחר, מבושל עם עגבניות פרש, ירקות שורש, שום ויין אדום.', 6200, null, 8, true, false, '{}'),
    (c, 'פרגית', 'סטייק פרגית במרינדת הבית על הגריל. מוגש עם אורז.', 6600, null, 9, true, false, '{}'),
    (c, 'סינייה', 'בשר בקר וטלה בבישול ארוך על מצע חציל קלוי בטאבון, טחינה וסלט עגבניות מרוקאי חריף מעל כל הטוב הזה. מוגש עם פוקאצ''ת הבית.', 6600, null, 10, true, false, '{}'),
    (c, 'טורק לחמג''ון', 'בשר בקר וטלה בבישול ארוך על בצק דק ופריך הנאפה במקום, עם פטרוזיליה, לימון וסלט עגבניות מרוקאי.', 6600, null, 11, true, false, '{}'),
    (c, 'פיש & צ''יפס', 'נתחי דג טריים בציפוי פריך וזהוב, מוגשים לצד צ''יפס חם ולימון.', 6600, null, 12, true, false, '{}'),
    (c, 'בקר סצ''ואן', 'בצל ירוק, בצל לבן, פטריות, פלפל אדום וטבעות פלפל צ''ילי, עם נתחי בקר פרוס דק ואורז ברוטב אסיאתי.', 6600, null, 13, true, false, '{}');

  -- הספיישלים שלנו
  insert into menu_categories (name_he, description_he, sort_order, is_active)
    values ('הספיישלים שלנו', null, 6, true) returning id into c;
  insert into menu_items
    (category_id, name_he, description_he, price_agorot, price_variants, sort_order, is_available, is_featured, tags)
  values
    (c, 'שקשוקית של אראל', 'תבשיל עגבניות מתובל עם בשר אנטריקוט טחון/עוף, פלפלים חריפים וביצה מבושלת בדיוק במידה הנכונה, בליווי פוקאצ''ת הבית, סלט כפרי וטחינה.', 7100, null, 1, true, false, '{}'),
    (c, 'פילה סלמון', 'נתח סלמון טרי עסיסי, צלוי לשלמות בטאבון, עם עשבי תיבול ועגבניות שרי קלויות, מוגש עם פירה.', 9000, null, 2, true, false, '{}'),
    (c, 'פסטה דה סלמון', 'נתח סלמון מובחר 220 גרם אחרי צלייה בטאבון אבן, מונח על פסטה פפרדלה ברוטב שמנת, קוביות בטטה ובצל ירוק.', 11500, null, 3, true, false, '{}'),
    (c, 'אנטרקוט', 'נתח אנטריקוט עסיסי מיושן צלוי במדויק, מתובל במלח ופלפל גרוס, מוגש עם צ''יפס.', 12900, null, 4, true, false, '{}'),
    (c, 'צלעות טלה', 'נמסות בפה, נצלות לשלמות ומחבקות את החיך, מוגש עם אורז.', 12900, null, 5, true, false, '{}');

  -- פלטות בשרים
  insert into menu_categories (name_he, description_he, sort_order, is_active)
    values ('פלטות בשרים', 'הפלטות מוגשות עם פוקאצ''ה ביתית, מיקס מטבלים וסלט כפרי גדול.', 7, true) returning id into c;
  insert into menu_items
    (category_id, name_he, description_he, price_agorot, price_variants, sort_order, is_available, is_featured, tags)
  values
    (c, 'פלטה זוגית', 'מבחר נתחים מובחרים — צלעות טלה, פרגיות במרינדה, נקניקיות וברוסקטות אסאדו.', 25900, null, 1, true, false, '{}'),
    (c, 'פלטת טריו', 'קרנבל בשרים הכולל אנטריקוט, צלעות טלה, פרגיות במרינדה, נקניקיות וברוסקטות אסאדו.', 38900, null, 2, true, false, '{}');

  -- פיצות
  insert into menu_categories (name_he, description_he, sort_order, is_active)
    values ('פיצות', null, 8, true) returning id into c;
  insert into menu_items
    (category_id, name_he, description_he, price_agorot, price_variants, sort_order, is_available, is_featured, tags)
  values
    (c, 'פיצה קלאסית', 'פיצה סטייל ניו-יורק הנאפית בטאבון לבנים לוהט עם 100% גבינת מוצרלה אמיתית ורוטב עגבניות ביתי.', 5200, null, 1, true, false, '{}'),
    (c, 'פיצה פיקאסו', 'יצירת אומנות של מוצרלה פרסקה, גבינת פטה ופרמז''נו רג''יאנו, על רוטב פסטו ושמן זית.', 5800, null, 2, true, false, '{}'),
    (c, 'תוספת לפיצה', 'פלפל חריף • זיתי קלמטה • בצל סגול • קוביות בטטה • עגבניות שרי • שום קונפי • בצל ירוק', 500, null, 3, true, false, '{}'),
    (c, 'תוספת לפיצה', 'פטה • אקסטרה מוצרלה • ביצת עין • פטריות', 700, null, 4, true, false, '{}');

  -- פסטות
  insert into menu_categories (name_he, description_he, sort_order, is_active)
    values ('פסטות', 'כל הפסטות מוגשות עם פסטה טרייה מסוג פנה טריו, או פפרדלה בתוספת 3 ₪. יש לנו גם פסטה ללא גלוטן.', 9, true) returning id into c;
  insert into menu_items
    (category_id, name_he, description_he, price_agorot, price_variants, sort_order, is_available, is_featured, tags)
  values
    (c, 'אלפרדו', 'קרם שמנת, חמאה, בזיליקום, שום ואגוז מוסקט.', 5400, null, 1, true, false, '{}'),
    (c, 'נפוליטנה', 'עגבניות פרש, שום, בזיליקום ואורגנו.', 5400, null, 2, true, false, '{}'),
    (c, 'רוזה', 'קרם שמנת, עגבניות פרש, חמאה, שום ובזיליקום.', 5400, null, 3, true, false, '{}'),
    (c, 'פסטו ג''נובז', 'קרם שמנת, פסטו, חמאה, בזיליקום, שום ואגוז מוסקט.', 5400, null, 4, true, false, '{}'),
    (c, 'תוספת פטריות', null, 500, null, 5, true, false, '{}'),
    (c, 'תוספת ערמונים', null, 700, null, 6, true, false, '{}'),
    (c, 'תוספת בטטה', null, 500, null, 7, true, false, '{}');

  -- רביולי
  insert into menu_categories (name_he, description_he, sort_order, is_active)
    values ('רביולי', 'הרביולי מוגש עם רוטב לבחירה: אלפרדו / נפוליטנה / רוזה / פסטו.', 10, true) returning id into c;
  insert into menu_items
    (category_id, name_he, description_he, price_agorot, price_variants, sort_order, is_available, is_featured, tags)
  values
    (c, 'רביולי גבינות', 'פסטה במילוי ריקוטה, מסקרפונה וגרנה פדנו.', 6300, null, 1, true, false, '{}'),
    (c, 'רביולי בטטה', 'פסטה במילוי בטטה מקורמלת.', 6300, null, 2, true, false, '{}'),
    (c, 'מק אנד צ''יז', 'רוטב גבינות קרמי ועשיר של צ''דר, מוצרלה וקרם שמנת. אמא''לה ואבא''לה!', 6300, null, 3, true, false, '{}');

  -- מהווק
  insert into menu_categories (name_he, description_he, sort_order, is_active)
    values ('מהווק', 'לבחירה: אטריות אורז או אטריות ביצים, עם עוף / בקר / טופו / חלומי / אסאדו.', 11, true) returning id into c;
  insert into menu_items
    (category_id, name_he, description_he, price_agorot, price_variants, sort_order, is_available, is_featured, tags)
  values
    (c, 'בנגקוק', 'אטריות טריות ותוספת לבחירה מוקפצים עם פטריות, גזר, שקדים, בצל לבן ובצל ירוק, ברוטב סצ''ואן וצ''ילי מתוק.', 5700, null, 1, true, false, '{}'),
    (c, 'קוסמוי חלומי', 'אטריות טריות וקוביות חלומי מוקפצות עם פטריות, גזר, שעועית ירוקה, בצל לבן ושקדים, ברוטב סטיר-פריי.', 5700, null, 2, true, false, '{}');

  -- סלטים
  insert into menu_categories (name_he, description_he, sort_order, is_active)
    values ('סלטים', null, 12, true) returning id into c;
  insert into menu_items
    (category_id, name_he, description_he, price_agorot, price_variants, sort_order, is_available, is_featured, tags)
  values
    (c, 'סלט ים תיכוני', 'מלא גבינה בולגרית על מצע חסה, מלפפון, גזר, עגבניות שרי, בצל סגול וזיתי קלמטה, בשמן זית ולימון.', 6000, null, 1, true, false, '{}'),
    (c, 'סלט קיסר', 'חסה קיסר, קרוטונים קראנצ''ים, ביצה קשה ושקדים פרוסים, ברוטב קיסר ופרמז''ן. (תוספת עוף 7 ₪)', 6000, null, 2, true, false, '{}'),
    (c, 'סלט גוצ''י', 'קרעים של מוצרלה פרסקה על מצע חסה קיסר, מלפפון, גזר, עגבניות שרי, פטרוזיליה ושקדים, בשמן זית, לימון ופסטו.', 6000, null, 3, true, false, '{}'),
    (c, 'כרובית בטחינה', 'פרחי כרובית עם עגבניות קצוצות, בצל סגול, פטרוזיליה, צ''ילי אדום, בצל ירוק ופלפל חריף בתיבול טחינה ולימון.', 6000, null, 4, true, false, '{}'),
    (c, 'סלט חלומי', 'קוביות חלומי קריספיות מוקפצות ברוטב סטיר-פריי עם פטריות טריות ואגוזי מלך על מצע חסה, מלפפון, גזר ובצל סגול, ברוטב ויניגרט.', 6500, null, 5, true, false, '{}'),
    (c, 'סלט השוק', 'חציל שלם שרוף על הגריל עם טחינה זעתר על מצע חסה, מלפפון, גזר, עגבניות שרי, פטריות, בצל סגול, קלמטה ופטרוזיליה, בשמן זית ולימון.', 6500, null, 6, true, false, '{}'),
    (c, 'סלט טוסט', 'קוביות טוסט עם מוצרלה ופסטו, עם בולגרית מגורדת על מצע חסה, גזר, מלפפון ועגבניות שרי, בתיבול ויניגרט.', 6500, null, 7, true, false, '{}'),
    (c, 'סלט עוף ושקדים', 'רצועות עוף ופטריות מוקפצות ברוטב סטיר-פריי על מצע חסה, גזר, מלפפון, בצל סגול, פטרוזיליה ושקדים, ברוטב ויניגרט.', 6500, null, 8, true, false, '{}'),
    (c, 'סלט קריספי שניצל', 'רצועות קריספי שניצל על מצע חסה קיסר, קרוטונים קראנצ''ים, שקדים פרוסים וביצה קשה, ברוטב קיסר.', 6500, null, 9, true, false, '{}'),
    (c, 'תוספת פוקאצ''ת הבית לסלט', null, 1000, null, 10, true, false, '{}');

  -- שלום על לחם
  insert into menu_categories (name_he, description_he, sort_order, is_active)
    values ('שלום על לחם', null, 13, true) returning id into c;
  insert into menu_items
    (category_id, name_he, description_he, price_agorot, price_variants, sort_order, is_available, is_featured, tags)
  values
    (c, 'כריך שניצל קריספי', 'עם חסה, מלפפון כבוש, בצל סגול ואיולי שום.', 5100, null, 1, true, false, '{}'),
    (c, 'כריך אנטריקוט', 'אנטריקוט פרוס דק על הפלנצ''ה, בצל מקורמל, פטריות מוקפצות, חסה ומלפפון כבוש, עם רוטב איולי חלפיניו.', 5100, null, 2, true, false, '{}'),
    (c, 'כריך פרגית', 'מפורקת על הפלנצ''ה עם בצל מטוגן, חסה ומלפפון כבוש, עם רוטב איולי חלפיניו.', 5100, null, 3, true, false, '{}'),
    (c, 'כריך אסאדו', 'אסאדו מפורק בבישול ארוך, חסה ומלפפון כבוש, עם רוטב איולי חלפיניו.', 5700, null, 4, true, false, '{}');

  -- ארוחות ילדים
  insert into menu_categories (name_he, description_he, sort_order, is_active)
    values ('ארוחות ילדים', 'לילדים עד גיל 12.', 14, true) returning id into c;
  insert into menu_items
    (category_id, name_he, description_he, price_agorot, price_variants, sort_order, is_available, is_featured, tags)
  values
    (c, 'ארוחת ילדים', 'מנה עיקרית לבחירה: שניצלונים וצ''יפס / פסטה אלפרדו / פסטה עגבניות / פסטה רוזה.
שתייה לבחירה: לימונדה / תפוזים / ענבים / תפוחים (שתייה מוגזת בתוספת 5 ₪).
כדור גלידה.', 5000, null, 1, true, false, '{}'),
    (c, 'ארוחת קומבו', 'מנה עיקרית: המבורגר 120 גרם עם צ''יפס.
שתייה לבחירה: לימונדה / תפוזים / ענבים / תפוחים (שתייה מוגזת בתוספת 5 ₪).
כדור גלידה.', 5000, null, 2, true, false, '{}');

  -- שתייה קלה
  insert into menu_categories (name_he, description_he, sort_order, is_active)
    values ('שתייה קלה', null, 15, true) returning id into c;
  insert into menu_items
    (category_id, name_he, description_he, price_agorot, price_variants, sort_order, is_available, is_featured, tags)
  values
    (c, 'משקה קל', 'פפסי / פפסי מקס / סבן אפ / דיאט סבן אפ / מירינדה / ענבים / XL', 1200, null, 1, true, false, '{}'),
    (c, 'מים בטעם', 'אפרסק / ענבים', 1300, null, 2, true, false, '{}'),
    (c, 'מים מינרליים / סודה', null, 1000, null, 3, true, false, '{}'),
    (c, 'בירה מאלט / אריזונה אפרסק', null, 1300, null, 4, true, false, '{}'),
    (c, 'סאן פלגרינו גדול', null, 2500, null, 5, true, false, '{}');

  -- המרעננים שלנו
  insert into menu_categories (name_he, description_he, sort_order, is_active)
    values ('המרעננים שלנו', null, 16, true) returning id into c;
  insert into menu_items
    (category_id, name_he, description_he, price_agorot, price_variants, sort_order, is_available, is_featured, tags)
  values
    (c, 'לימונדה / תפוזים', null, 1200, null, 1, true, false, '{}'),
    (c, 'לימונענע גרוס', null, 1600, null, 2, true, false, '{}'),
    (c, 'קפה קר / שוקו קר', null, 1200, null, 3, true, false, '{}'),
    (c, 'קנקן לימונדה / תפוזים', null, 2600, null, 4, true, false, '{}'),
    (c, 'קנקן לימונענע גרוס', null, 3400, null, 5, true, false, '{}'),
    (c, 'מילקשייק בטעמים', null, 2600, null, 6, true, false, '{}'),
    (c, 'סחוט טבעי', 'גזר / גזר-תפוח / תפוזגזר / תפוח-ג''ינג''ר (תוספת 3 ₪)', 1600, null, 7, true, false, '{}'),
    (c, 'לימונערק גרוס', 'ברוך בורא הערק! נענע ולימונדה, גרוסים עם קרח ואהבה ♥', 3200, null, 8, true, false, '{}');
end $$;

-- הודעת האלרגנים מהתפריט המודפס — מוצגת בראש עמוד התפריט (ניתן לערוך ב"טקסטים באתר")
update restaurant_settings
  set site_texts = coalesce(site_texts, '{}'::jsonb) || jsonb_build_object('menu.intro', 'ניתן לקבל את ההמבורגר בלחמנייה ללא גלוטן. מטבח אלכסנדר אינו סביבה נטולת גלוטן, ולכן עלולות להיות שאריות גלוטן במנות. לתשומת לבכם: המנות עשויות להכיל סויה, בוטנים, ביצים, שומשום, גלוטן (חיטה) ורכיבים אלרגניים נוספים.');

-- סה"כ: 16 קטגוריות, 109 מנות

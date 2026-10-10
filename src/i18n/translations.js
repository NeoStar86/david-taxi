import { uiStrings } from "./uiStrings.js";

export const SUPPORTED_LANGS = ["he", "en", "ru", "ar"];
export { getLocalizedContent } from "./localizedContent.js";

export const LOCALE_META = {
  he: { label: "עברית", dir: "rtl" },
  en: { label: "English", dir: "ltr" },
  ru: { label: "Русский", dir: "ltr" },
  ar: { label: "العربية", dir: "rtl" },
};

function buildDictionary(lang, core) {
  return { ...uiStrings[lang], ...core };
}

const dictionaries = {
  he: buildDictionary("he", {
    nav: { call: "חייג עכשיו", whatsapp: "הזמן ב-WhatsApp", home: "ראשי", calculator: "מחשבון" },
    hero: { chooseVehicle: "בחרו סוג רכב להמשך", passengers: "עד {n} נוסעים", carPhotoAlt: "תמונת רכב" },
    calc: {
      kicker: "מחשבון אומדן מחיר מהיר",
      title: "כמה תעלה הנסיעה?",
      subtitle: "בוחרים מוצא ויעד, מקבלים טווח מחיר וזמן משוער — וממשיכים ישר ל-WhatsApp.",
      origin: "עיר מוצא",
      destination: "יעד",
      disclaimer: "* האומדן לצורך התמצאות בלבד. המחיר הסופי ייקבע לפני תחילת הנסיעה.",
      priceRange: "טווח מחיר משוער",
      eta: "זמן נסיעה משוער",
      route: "מ{origin} ל{destination}",
      approximate: " · אומדן כללי",
      surge: " · תוספת {n}%",
      vehicle: "סוג רכב",
      backToVehicles: "חזור לבחירת רכב",
      whatsappCta: "הזמן במחיר זה ב-WhatsApp",
      minutes: "כ-{n} דקות",
      errors: {
        pickRoute: "נא לבחור עיר מוצא ויעד.",
        sameCity: "עיר המוצא והיעד זהות — בחרו יעד שונה.",
        pickVehicle: "נא לבחור סוג רכב לפני המשך.",
      },
    },
    wa: {
      fareIntro: "היי דוד, אשמח להזמין נסיעה לפי האומדן:",
      origin: "מוצא",
      destination: "יעד",
      vehicle: "סוג רכב",
      price: "אומדן מחיר",
      eta: "זמן נסיעה משוער",
      closing: "אשמח לאישור סופי ולהזמנה. תודה!",
    },
  }),
  en: buildDictionary("en", {
    nav: { call: "Call now", whatsapp: "Book on WhatsApp", home: "Home", calculator: "Calculator" },
    hero: {
      chooseVehicle: "Choose a vehicle to continue",
      passengers: "Up to {n} passengers",
      carPhotoAlt: "Vehicle photo",
    },
    calc: {
      kicker: "Quick fare estimator",
      title: "How much will the ride cost?",
      subtitle: "Pick origin and destination, get a price range and ETA — then continue on WhatsApp.",
      origin: "Origin city",
      destination: "Destination",
      disclaimer: "* Estimate for reference only. Final price is confirmed before the trip.",
      priceRange: "Estimated price range",
      eta: "Estimated travel time",
      route: "{origin} → {destination}",
      approximate: " · general estimate",
      surge: " · +{n}% surcharge",
      vehicle: "Vehicle type",
      backToVehicles: "Back to vehicle selection",
      whatsappCta: "Book this fare on WhatsApp",
      minutes: "~{n} min",
      errors: {
        pickRoute: "Please enter origin and destination.",
        sameCity: "Origin and destination are the same — pick a different destination.",
        pickVehicle: "Please select a vehicle type first.",
      },
    },
    wa: {
      fareIntro: "Hi David, I'd like to book a ride based on this estimate:",
      origin: "From",
      destination: "To",
      vehicle: "Vehicle",
      price: "Price estimate",
      eta: "Estimated time",
      closing: "Please confirm and book. Thanks!",
    },
  }),
  ru: buildDictionary("ru", {
    nav: { call: "Позвонить", whatsapp: "Заказать в WhatsApp", home: "Главная", calculator: "Калькулятор" },
    hero: {
      chooseVehicle: "Выберите тип автомобиля",
      passengers: "До {n} пассажиров",
      carPhotoAlt: "Фото автомобиля",
    },
    calc: {
      kicker: "Быстрый расчёт стоимости",
      title: "Сколько будет стоить поездка?",
      subtitle: "Укажите откуда и куда — получите диапазон цены и время — затем WhatsApp.",
      origin: "Город отправления",
      destination: "Пункт назначения",
      disclaimer: "* Оценка только для ориентира. Итоговая цена согласуется до поездки.",
      priceRange: "Ориентировочная цена",
      eta: "Примерное время в пути",
      route: "{origin} → {destination}",
      approximate: " · общая оценка",
      surge: " · надбавка {n}%",
      vehicle: "Тип авто",
      backToVehicles: "Вернуться к выбору авто",
      whatsappCta: "Заказать по этой цене в WhatsApp",
      minutes: "~{n} мин",
      errors: {
        pickRoute: "Укажите город отправления и назначения.",
        sameCity: "Отправление и назначение совпадают — выберите другой пункт.",
        pickVehicle: "Сначала выберите тип автомобиля.",
      },
    },
    wa: {
      fareIntro: "Привет, Дavid! Хочу заказать поездку по этой оценке:",
      origin: "Откуда",
      destination: "Куда",
      vehicle: "Авто",
      price: "Оценка цены",
      eta: "Примерное время",
      closing: "Жду подтверждения. Спасибо!",
    },
  }),
  ar: buildDictionary("ar", {
    nav: { call: "اتصل الآن", whatsapp: "احجز عبر WhatsApp", home: "الرئيسية", calculator: "الحاسبة" },
    hero: {
      chooseVehicle: "اختر نوع المركبة للمتابعة",
      passengers: "حتى {n} ركاب",
      carPhotoAlt: "صورة المركبة",
    },
    calc: {
      kicker: "حاسبة تقدير السعر السريعة",
      title: "كم ستكلف الرحلة؟",
      subtitle: "اختر نقطة الانطلاق والوجهة — احصل على نطاق السعر والوقت — ثم WhatsApp.",
      origin: "مدينة الانطلاق",
      destination: "الوجهة",
      disclaimer: "* التقدير للإرشاد فقط. السعر النهائي يُحدد قبل الرحلة.",
      priceRange: "نطاق السعر التقديري",
      eta: "الوقت التقريبي",
      route: "{origin} ← {destination}",
      approximate: " · تقدير عام",
      surge: " · إضافة {n}%",
      vehicle: "نوع المركبة",
      backToVehicles: "العودة لاختيار المركبة",
      whatsappCta: "احجز بهذا السعر عبر WhatsApp",
      minutes: "~{n} دقيقة",
      errors: {
        pickRoute: "يرجى إدخال مدينة الانطلاق والوجهة.",
        sameCity: "الانطلاق والوجهة متطابقان — اختر وجهة أخرى.",
        pickVehicle: "يرجى اختيار نوع المركبة أولاً.",
      },
    },
    wa: {
      fareIntro: "مرحباً ديفيد، أود حجز رحلة حسب هذا التقدير:",
      origin: "من",
      destination: "إلى",
      vehicle: "المركبة",
      price: "تقدير السعر",
      eta: "الوقت التقريبي",
      closing: "أرجو التأكيد والحجز. شكراً!",
    },
  }),
};

function interpolate(template, vars = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}

export function translate(lang, key) {
  const parts = key.split(".");
  let node = dictionaries[lang] ?? dictionaries.he;
  for (const part of parts) {
    node = node?.[part];
  }
  if (typeof node !== "string") {
    node = dictionaries.he;
    for (const part of parts) {
      node = node?.[part];
    }
  }
  return typeof node === "string" ? node : key;
}

export function t(lang, key, vars) {
  return interpolate(translate(lang, key), vars);
}

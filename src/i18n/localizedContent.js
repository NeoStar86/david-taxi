/** Structured page content per language (services, FAQ, nav, etc.) */
export const localizedContent = {
  he: {
    navLinks: [
      { href: "#services", label: "שירותים" },
      { href: "#advantages", label: "יתרונות" },
      { href: "#areas", label: "אזורי שירות" },
      { href: "#calculator", label: "מחשבון" },
      { href: "#contact", label: "צור קשר" },
    ],
    services: [
      {
        icon: "plane",
        title: 'הסעות לנתב"ג',
        description:
          "נסיעות מדויקות ובזמן לשדה התעופה וממנו, כולל מעקב בזמן אמת אחר לוח הטיסות.",
      },
      {
        icon: "map-pin",
        title: "נסיעות בין-עירוניות",
        description: "נסיעות נוחות ובטוחות לכל חלקי הארץ ברכב חדיש, נקי וממוזג.",
      },
      {
        icon: "crown",
        title: "הסעות VIP ואירועים",
        description: 'שירות פרימיום מותאם אישית לאירועים מיוחדים, פגישות עסקיות ואורחים מחו"ל.',
      },
      {
        icon: "package",
        title: "משלוחים וחבילות",
        description: "שירות משלוחים מהיר ואמין של חבילות ומסמכים דחופים מבית לבית.",
      },
    ],
    advantages: [
      { icon: "clock", title: "זמינות 24/7", text: "זמין לשיחות והזמנות סביב השעון." },
      { icon: "shield-check", title: "עמידה בזמנים", text: "הגעה מדויקת ללא עיכובים." },
      { icon: "sparkles", title: "רכב חדיש ומרווח", text: "נסיעה שקטה, נקייה ונעימה." },
      { icon: "credit-card", title: "מחירים הוגנים", text: "שקיפות מלאה מראש ללא הפתעות." },
    ],
    areaTags: ["תל אביב והמרכז", "אזור השרון", "ירושלים והסביבה", 'נתב"ג', "אזור השפלה"],
    faqs: [
      {
        question: 'כמה זמן מראש מומלץ להזמין נסיעה לנתב"ג?',
        answer:
          "מומלץ להזמין לפחות 24 שעות מראש כדי להבטיח זמינות מלאה, אך ניתן ליצור קשר גם לקריאות דחופות מהיום להיום.",
      },
      {
        question: "אילו אמצעי תשלום מתקבלים?",
        answer: "ניתן לשלם במזומן, בכרטיסי אשראי, ב-Bit או בהעברה בנקאית.",
      },
      {
        question: "האם המחיר נקבע מראש?",
        answer: "כן! לפני תחילת הנסיעה ניתן לקבל הצעת מחיר שקופה וקבועה מראש ללא הפתעות.",
      },
      {
        question: "האם יש אפשרות לכיסא בטיחות לילדים?",
        answer: "כן, ניתן לתאם מראש כיסא בטיחות לתינוקות או בוסטר בהתאם לצורך.",
      },
    ],
  },
  en: {
    navLinks: [
      { href: "#services", label: "Services" },
      { href: "#advantages", label: "Advantages" },
      { href: "#areas", label: "Service areas" },
      { href: "#calculator", label: "Calculator" },
      { href: "#contact", label: "Contact" },
    ],
    services: [
      {
        icon: "plane",
        title: "Airport transfers",
        description: "On-time rides to and from the airport, with real-time flight tracking.",
      },
      {
        icon: "map-pin",
        title: "Inter-city rides",
        description: "Comfortable, safe trips nationwide in a clean, air-conditioned vehicle.",
      },
      {
        icon: "crown",
        title: "VIP & events",
        description: "Premium service for special events, business meetings, and guests.",
      },
      {
        icon: "package",
        title: "Deliveries",
        description: "Fast, reliable door-to-door delivery of packages and urgent documents.",
      },
    ],
    advantages: [
      { icon: "clock", title: "24/7 availability", text: "Available for calls and bookings around the clock." },
      { icon: "shield-check", title: "On time", text: "Precise pickup without unnecessary delays." },
      { icon: "sparkles", title: "Modern spacious car", text: "Quiet, clean, comfortable ride." },
      { icon: "credit-card", title: "Fair pricing", text: "Full transparency upfront — no surprises." },
    ],
    areaTags: ["Tel Aviv & Center", "Sharon region", "Jerusalem area", "Ben Gurion Airport", "Shfela region"],
    faqs: [
      {
        question: "How far in advance should I book an airport ride?",
        answer: "We recommend at least 24 hours ahead, but same-day urgent requests are also welcome.",
      },
      {
        question: "Which payment methods do you accept?",
        answer: "Cash, credit cards, Bit, and bank transfer.",
      },
      {
        question: "Is the price fixed in advance?",
        answer: "Yes — you get a clear quote before the trip starts.",
      },
      {
        question: "Do you provide child seats?",
        answer: "Yes — infant seats or boosters can be arranged in advance.",
      },
    ],
  },
  ru: {
    navLinks: [
      { href: "#services", label: "Услуги" },
      { href: "#advantages", label: "Преимущества" },
      { href: "#areas", label: "Зоны обслуживания" },
      { href: "#calculator", label: "Калькулятор" },
      { href: "#contact", label: "Контакты" },
    ],
    services: [
      {
        icon: "plane",
        title: "Трансфер в аэропорт",
        description: "Точные поездки в аэропорт и обратно с отслеживанием рейсов.",
      },
      {
        icon: "map-pin",
        title: "Межгородские поездки",
        description: "Комфортные и безопасные поездки по всей стране на новом авто.",
      },
      {
        icon: "crown",
        title: "VIP и мероприятия",
        description: "Премиальный сервис для событий, деловых встреч и гостей.",
      },
      {
        icon: "package",
        title: "Доставка",
        description: "Быстрая доставка посылок и срочных документов от двери до двери.",
      },
    ],
    advantages: [
      { icon: "clock", title: "24/7", text: "Принимаем заказы и звонки круглосуточно." },
      { icon: "shield-check", title: "Пунктуальность", text: "Точная подача без лишних задержек." },
      { icon: "sparkles", title: "Новый просторный авто", text: "Тихая, чистая и комфортная поездка." },
      { icon: "credit-card", title: "Честные цены", text: "Полная прозрачность заранее." },
    ],
    areaTags: ["Тель-Авив и центр", "Шарон", "Иерусалим и окрестности", "Аэропорт", "Шфела"],
    faqs: [
      {
        question: "За сколько заранее лучше заказывать поездку в аэропорт?",
        answer: "Рекомендуем минимум за 24 часа, но принимаем и срочные заказы в тот же день.",
      },
      {
        question: "Какие способы оплаты принимаются?",
        answer: "Наличные, карты, Bit и банковский перевод.",
      },
      {
        question: "Цена фиксируется заранее?",
        answer: "Да — прозрачная смета до начала поездки.",
      },
      {
        question: "Есть детские кресла?",
        answer: "Да — можно заранее заказать кресло или бустер.",
      },
    ],
  },
  ar: {
    navLinks: [
      { href: "#services", label: "الخدمات" },
      { href: "#advantages", label: "المزايا" },
      { href: "#areas", label: "مناطق الخدمة" },
      { href: "#calculator", label: "الحاسبة" },
      { href: "#contact", label: "اتصل بنا" },
    ],
    services: [
      {
        icon: "plane",
        title: "توصيل للمطار",
        description: "رحلات دقيقة من وإلى المطار مع متابعة الرحلات.",
      },
      {
        icon: "map-pin",
        title: "رحلات بين المدن",
        description: "رحلات مريحة وآمنة في جميع أنحاء البلاد بسيارة حديثة.",
      },
      {
        icon: "crown",
        title: "VIP والفعاليات",
        description: "خدمة مميزة للمناسبات والاجتماعات واستقبال الضيوف.",
      },
      {
        icon: "package",
        title: "توصيل طرود",
        description: "توصيل سريع وموثوق للطرود والمستندات العاجلة.",
      },
    ],
    advantages: [
      { icon: "clock", title: "متاح 24/7", text: "للحجز والاتصال على مدار الساعة." },
      { icon: "shield-check", title: "الالتزام بالوقت", text: "وصول دقيق دون تأخير غير ضروري." },
      { icon: "sparkles", title: "سيارة حديثة وواسعة", text: "رحلة هادئة ونظيفة ومريحة." },
      { icon: "credit-card", title: "أسعار عادلة", text: "شفافية كاملة مسبقاً." },
    ],
    areaTags: ["تل أبيب والمركز", "منطقة شaron", "القدس والمحيط", "مطار بن غوريون", "منطقة الشفela"],
    faqs: [
      {
        question: "متى يُفضل حجز رحلة للمطار؟",
        answer: "ننصح قبل 24 ساعة على الأقل، مع إمكانية الطلبات العاجلة في نفس اليوم.",
      },
      {
        question: "ما طرق الدفع المقبولة؟",
        answer: "نقداً، بطاقات، Bit أو تحويل بنكي.",
      },
      {
        question: "هل السعر ثابت مسبقاً؟",
        answer: "نعم — عرض سعر واضح قبل بدء الرحلة.",
      },
      {
        question: "هل توجد مقاعد أطفال؟",
        answer: "نعم — يمكن ترتيب مقعد أو booster مسبقاً.",
      },
    ],
  },
};

export function getLocalizedContent(lang) {
  return localizedContent[lang] ?? localizedContent.he;
}

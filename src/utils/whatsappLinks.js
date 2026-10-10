import { site } from "../content";

export function openWhatsApp(text) {
  const url = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function buildFareWhatsAppMessage({ origin, destination, min, max, minutes }) {
  return [
    "היי דוד, אשמח להזמין נסיעה לפי האומדן:",
    "",
    `*מוצא:* ${origin}`,
    `*יעד:* ${destination}`,
    `*אומדן מחיר:* ${min}-${max} ₪`,
    `*זמן נסיעה משוער:* כ-${minutes} דקות`,
    "",
    "אשמח לאישור סופי ולהזמנה. תודה!",
  ].join("\n");
}

export const locationShareMessage =
  "היי דוד, אשמח להזמין מונית. הנה המיקום הנוכחי שלי:\n\n";

export function openLocationShareWhatsApp() {
  openWhatsApp(locationShareMessage);
}

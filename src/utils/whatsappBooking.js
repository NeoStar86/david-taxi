import { t } from "../i18n/translations";

function formatDateTime(value, lang) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const locale = lang === "he" ? "he-IL" : lang === "ar" ? "ar-IL" : lang === "ru" ? "ru-RU" : "en-GB";
  return date.toLocaleString(locale, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function buildBookingWhatsAppUrl(form, site, lang = "he") {
  const lines = [
    t(lang, "bookingWa.intro"),
    "",
    `*${t(lang, "bookingWa.fullName")}:* ${form.fullName.trim()}`,
    `*${t(lang, "bookingWa.phone")}:* ${form.phone.trim()}`,
    `*${t(lang, "bookingWa.pickup")}:* ${form.pickup.trim()}`,
    `*${t(lang, "bookingWa.destination")}:* ${form.destination.trim()}`,
    `*${t(lang, "bookingWa.dateTime")}:* ${formatDateTime(form.dateTime, lang)}`,
  ];

  if (form.notes.trim()) {
    lines.push(`*${t(lang, "bookingWa.notes")}:* ${form.notes.trim()}`);
  }

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${site.whatsapp}?text=${text}`;
}

import { site } from "../content";

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("he-IL", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function buildBookingWhatsAppUrl(form) {
  const lines = [
    "שלום דוד, אשמח לקבל הצעת מחיר לנסיעה:",
    "",
    `*שם מלא:* ${form.fullName.trim()}`,
    `*טלפון:* ${form.phone.trim()}`,
    `*נקודת איסוף:* ${form.pickup.trim()}`,
    `*יעד נסיעה:* ${form.destination.trim()}`,
    `*תאריך ושעה:* ${formatDateTime(form.dateTime)}`,
  ];

  if (form.notes.trim()) {
    lines.push(`*הערות נוספות:* ${form.notes.trim()}`);
  }

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${site.whatsapp}?text=${text}`;
}

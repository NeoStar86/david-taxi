export function buildDriverGroupShareText(ride, site) {
  const commission = ride.commissionPercent ?? 10;
  const route =
    ride.origin && ride.destination ? `${ride.origin} → ${ride.destination}` : "לא צוין מסלול";
  const when = ride.dateTime
    ? new Date(ride.dateTime).toLocaleString("he-IL", { dateStyle: "short", timeStyle: "short" })
    : "לא צוין";

  return [
    "🚕 *נסיעה למכירה / העברה לנהג*",
    "",
    `👤 *לקוח:* ${ride.clientName || "—"}`,
    `📞 *טלפון:* ${ride.phone || "—"}`,
    `📍 *מסלול:* ${route}`,
    `🕒 *מועד:* ${when}`,
    `🚗 *סוג רכב:* ${ride.vehicleType || "—"}`,
    `💰 *מחיר מוסכם:* ${ride.agreedPrice ? `${ride.agreedPrice} ₪` : "—"}`,
    `📊 *עמלת מסור:* ${commission}%`,
    `📌 *סטטוס:* ${ride.status}`,
    "",
    `📲 *יצירת קשר עם דוד:*`,
    `טלפון: ${site.phoneDisplay}`,
    `WhatsApp: https://wa.me/${site.whatsapp}`,
    "",
    "— נשלח מיומן נסיעות דוד מוניות",
  ].join("\n");
}

export function shareRideToDriverGroup(ride, site) {
  const text = buildDriverGroupShareText(ride, site);
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

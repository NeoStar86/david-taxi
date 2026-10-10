export const SHARE_TEMPLATE_STANDARD = "standard";
export const SHARE_TEMPLATE_URGENT = "urgent";

export const SHARE_TEMPLATES = [
  { id: SHARE_TEMPLATE_STANDARD, label: "הצעת נסיעה רגילה" },
  { id: SHARE_TEMPLATE_URGENT, label: "🚨 נסיעה דחופה לעכשיו" },
];

function formatShareDateTime(dateTime) {
  if (!dateTime) {
    return { dayLine: "—", timeLine: "—" };
  }
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) {
    return { dayLine: String(dateTime), timeLine: "—" };
  }
  const dayLine = date.toLocaleDateString("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeLine = date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
  return { dayLine, timeLine };
}

function dash(value, fallback = "—") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

/** Public driver-group message only — no commission, profit, or internal accounting. */
export function buildDriverGroupShareText(ride, templateId = SHARE_TEMPLATE_STANDARD) {
  const orderLabel = ride.orderId || (ride.orderNumber ? `#${ride.orderNumber}` : "#—");
  const { dayLine, timeLine } = formatShareDateTime(ride.dateTime);
  const price = ride.basePrice || ride.agreedPrice;
  const priceDisplay = price ? String(price).replace(/\s/g, "") : "—";
  const payment = ride.paymentMethod || "מזומן";

  const lines = [];

  if (templateId === SHARE_TEMPLATE_URGENT) {
    lines.push(
      "🚨 *נסיעה דחופה לעכשיו!*",
      "נדרש נהג פנוי *מיידית* — אנא צרו קשר בהקדם",
      "",
    );
  }

  lines.push(
    `🚕 נסיעה ${orderLabel} – מוניות דוד`,
    "────────────────",
    `📅 ${dayLine}`,
    `⏰ שעת איסוף: ${timeLine}`,
    `🌆 עיר: ${dash(ride.cityRegion)}`,
    `🏠 איסוף: ${dash(ride.pickup || ride.origin)}`,
    `🏁 יעד: ${dash(ride.destination)}`,
    `👥 נוסעים: ${dash(ride.passengersCount, "לא צוין")}`,
    `🧳 מטען: ${dash(ride.luggageDetails, "לא צוין")}`,
  );

  const flight = String(ride.flightNumber ?? "").trim();
  if (flight) {
    lines.push(`✈️ טיסה: ${flight}`);
  }

  lines.push(
    `💰 מחיר: ${priceDisplay} ₪ (${payment})`,
    `🚕 רכב: ${dash(ride.vehicleType)}`,
    "────────────────",
    `👤 לקוח: ${dash(ride.clientName)}`,
    `📞 ${dash(ride.phone)}`,
  );

  if (templateId === SHARE_TEMPLATE_URGENT) {
    lines.push("", "⚡ *עדיפות גבוהה — נסיעה לעכשיו*");
  }

  return lines.join("\n");
}

export function openDriverGroupShare(ride, templateId = SHARE_TEMPLATE_STANDARD) {
  const text = buildDriverGroupShareText(ride, templateId);
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/** @deprecated Use openDriverGroupShare with template modal */
export function shareRideToDriverGroup(ride) {
  openDriverGroupShare(ride, SHARE_TEMPLATE_STANDARD);
}

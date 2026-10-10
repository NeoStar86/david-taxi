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
export function buildDriverGroupShareText(ride) {
  const orderLabel = ride.orderId || (ride.orderNumber ? `#${ride.orderNumber}` : "#—");
  const { dayLine, timeLine } = formatShareDateTime(ride.dateTime);
  const price = ride.basePrice || ride.agreedPrice;
  const priceDisplay = price ? String(price).replace(/\s/g, "") : "—";
  const payment = ride.paymentMethod || "מזומן";

  const lines = [
    `🚕 נסיעה ${orderLabel} – מוניות דוד`,
    "────────────────",
    `📅 ${dayLine}`,
    `⏰ שעת איסוף: ${timeLine}`,
    `🌆 עיר: ${dash(ride.cityRegion)}`,
    `🏠 איסוף: ${dash(ride.pickup || ride.origin)}`,
    `🏁 יעד: ${dash(ride.destination)}`,
    `👥 נוסעים: ${dash(ride.passengersCount, "לא צוין")}`,
    `🧳 מטען: ${dash(ride.luggageDetails, "לא צוין")}`,
  ];

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

  return lines.join("\n");
}

export function shareRideToDriverGroup(ride) {
  const text = buildDriverGroupShareText(ride);
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

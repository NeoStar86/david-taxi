export const RIDE_STATUSES = ["מתוכננת", "בוצעה", "למכירה/העברה", "בוטלה"];

export const DEFAULT_COMMISSION_PERCENT = 10;

export function createRide(fields) {
  return {
    id: `ride-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    source: fields.source ?? "manual",
    clientName: fields.clientName ?? "",
    phone: fields.phone ?? "",
    origin: fields.origin ?? "",
    destination: fields.destination ?? "",
    dateTime: fields.dateTime ?? "",
    vehicleType: fields.vehicleType ?? "",
    agreedPrice: fields.agreedPrice ?? "",
    status: fields.status ?? "מתוכננת",
    commissionPercent: fields.commissionPercent ?? DEFAULT_COMMISSION_PERCENT,
  };
}

export function rideFromWebsiteLead(lead) {
  const payload = lead.payload ?? {};
  const price =
    payload.min != null && payload.max != null
      ? `${payload.min}-${payload.max}`
      : payload.min ?? payload.max ?? "";

  return createRide({
    source: "website",
    clientName: payload.fullName || "לקוח מהאתר",
    phone: payload.phone ?? "",
    origin: payload.pickup || payload.origin || "",
    destination: payload.destination ?? "",
    dateTime: payload.dateTime ?? lead.createdAt,
    vehicleType: payload.vehicleLabel || payload.vehicleId || "",
    agreedPrice: price,
    status: "מתוכננת",
  });
}

export function parsePriceNumber(agreedPrice) {
  if (typeof agreedPrice === "number") return agreedPrice;
  const text = String(agreedPrice ?? "");
  const numbers = text.match(/\d+/g);
  if (!numbers?.length) return 0;
  if (numbers.length >= 2) {
    return (Number(numbers[0]) + Number(numbers[1])) / 2;
  }
  return Number(numbers[0]) || 0;
}

export function isRideInMonth(ride, year, monthIndex) {
  const raw = ride.dateTime || ride.createdAt;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return false;
  return date.getFullYear() === year && date.getMonth() === monthIndex;
}

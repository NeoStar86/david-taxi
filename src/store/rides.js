export const RIDE_STATUSES = ["מתוכננת", "בוצעה", "למכירה/העברה", "בוטלה"];

export const PAYMENT_METHODS = ["מזומן", "אשראי"];

export const COMMISSION_TYPES = [
  { id: "percent", label: "אחוזים (%)" },
  { id: "fixed", label: "סכום קבוע (₪)" },
];

export const DEFAULT_COMMISSION_PERCENT = 10;

export const ORDER_ID_START = 2500;

function rideFieldDefaults() {
  return {
    clientName: "",
    phone: "",
    origin: "",
    destination: "",
    pickup: "",
    cityRegion: "",
    dateTime: "",
    vehicleType: "",
    basePrice: "",
    agreedPrice: "",
    paymentMethod: "מזומן",
    commissionType: "percent",
    commissionPercent: DEFAULT_COMMISSION_PERCENT,
    commissionFixed: "",
    assignedDriverName: "",
    passengersCount: "",
    luggageDetails: "",
    flightNumber: "",
    status: "מתוכננת",
  };
}

export function formatOrderId(orderNumber) {
  return `#${orderNumber}`;
}

export function parseOrderIdNumber(orderId) {
  if (orderId == null) return 0;
  const text = String(orderId).replace(/^#/, "");
  const n = Number.parseInt(text, 10);
  return Number.isFinite(n) ? n : 0;
}

export function allocateNextOrderNumber(existingRides = []) {
  let max = ORDER_ID_START;
  for (const ride of existingRides) {
    const n = ride.orderNumber ?? parseOrderIdNumber(ride.orderId);
    if (n > max) max = n;
  }
  return max + 1;
}

export function normalizeRide(ride, orderNumberFallback) {
  const base = { ...rideFieldDefaults(), ...ride };
  const orderNumber =
    base.orderNumber ?? parseOrderIdNumber(base.orderId) ?? orderNumberFallback ?? null;

  const withOrder =
    orderNumber && orderNumber > 0
      ? { ...base, orderNumber, orderId: formatOrderId(orderNumber) }
      : base;

  if (!withOrder.basePrice && withOrder.agreedPrice) {
    withOrder.basePrice = withOrder.agreedPrice;
  }
  if (!withOrder.agreedPrice && withOrder.basePrice) {
    withOrder.agreedPrice = withOrder.basePrice;
  }
  if (!withOrder.pickup && withOrder.origin) {
    withOrder.pickup = withOrder.origin;
  }

  return withOrder;
}

export function normalizeRides(rides = []) {
  let next = ORDER_ID_START;
  for (const ride of rides) {
    const n = ride.orderNumber ?? parseOrderIdNumber(ride.orderId);
    if (n > next) next = n;
  }

  return rides.map((ride) => {
    const n = ride.orderNumber ?? parseOrderIdNumber(ride.orderId);
    if (n > 0) {
      return normalizeRide(ride);
    }
    next += 1;
    return normalizeRide(ride, next);
  });
}

export function createRide(fields, existingRides = []) {
  const orderNumber = allocateNextOrderNumber(existingRides);
  const merged = { ...rideFieldDefaults(), ...fields };
  const basePrice = merged.basePrice || merged.agreedPrice || "";
  return normalizeRide({
    id: `ride-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    source: merged.source ?? "manual",
    ...merged,
    orderNumber,
    orderId: formatOrderId(orderNumber),
    basePrice: String(basePrice),
    agreedPrice: String(basePrice),
    pickup: merged.pickup || merged.origin || "",
  });
}

export function rideFromWebsiteLead(lead, existingRides = []) {
  const payload = lead.payload ?? {};
  const price =
    payload.min != null && payload.max != null
      ? `${payload.min}-${payload.max}`
      : payload.min ?? payload.max ?? "";

  return createRide(
    {
      source: "website",
      clientName: payload.fullName || "לקוח מהאתר",
      phone: payload.phone ?? "",
      origin: payload.pickup || payload.origin || "",
      destination: payload.destination ?? "",
      pickup: payload.pickup || payload.origin || "",
      cityRegion: payload.cityRegion ?? "",
      dateTime: payload.dateTime ?? lead.createdAt,
      vehicleType: payload.vehicleLabel || payload.vehicleId || "",
      basePrice: price,
      passengersCount: payload.passengers != null ? String(payload.passengers) : "",
      luggageDetails: payload.luggage ?? "",
      flightNumber: payload.flightNumber ?? "",
      status: "מתוכננת",
    },
    existingRides,
  );
}

export function parsePriceNumber(value) {
  if (typeof value === "number") return value;
  const text = String(value ?? "");
  const numbers = text.match(/\d+/g);
  if (!numbers?.length) return 0;
  if (numbers.length >= 2) {
    return (Number(numbers[0]) + Number(numbers[1])) / 2;
  }
  return Number(numbers[0]) || 0;
}

export function computeCommissionAmount(ride) {
  const base = parsePriceNumber(ride.basePrice || ride.agreedPrice);
  if (ride.commissionType === "fixed") {
    return parsePriceNumber(ride.commissionFixed);
  }
  const percent = Number(ride.commissionPercent);
  if (!Number.isFinite(percent) || percent <= 0) return 0;
  return (base * percent) / 100;
}

export function computeNetProfit(ride) {
  return computeCommissionAmount(ride);
}

export function publicSharePrice(ride) {
  const raw = ride.basePrice || ride.agreedPrice;
  if (!raw) return "—";
  const n = parsePriceNumber(raw);
  if (String(raw).includes("-") && n > 0) {
    return String(raw).replace(/\s/g, "");
  }
  return n > 0 ? String(Math.round(n)) : String(raw);
}

export function isRideInMonth(ride, year, monthIndex) {
  const raw = ride.dateTime || ride.createdAt;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return false;
  return date.getFullYear() === year && date.getMonth() === monthIndex;
}

export function filterRides(rides, query) {
  const q = query.trim().toLowerCase().replace(/^#/, "");
  if (!q) return rides;

  return rides.filter((ride) => {
    const parts = [
      ride.orderId,
      String(ride.orderNumber ?? ""),
      ride.assignedDriverName,
      ride.clientName,
      ride.phone,
      ride.origin,
      ride.destination,
      ride.pickup,
      ride.cityRegion,
    ];
    const haystack = parts
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .replace(/#/g, "");
    return haystack.includes(q);
  });
}

export const originSuggestions = [
  "תל אביב",
  "ראשון לציון",
  "פתח תקווה",
  "נתניה",
  "רמת גן",
  "גבעתיים",
  "הרצליה",
  "חולון",
];

export const destinationSuggestions = [
  'נתב"ג',
  "ירושלים",
  "חיפה",
  "תל אביב",
  "ראשון לציון",
  "פתח תקווה",
  "נתניה",
  "באר שבע",
];

const routeTable = {
  'תל אביב|נתב"ג': { min: 140, max: 170, minutes: 25 },
  'ראשון לציון|נתב"ג': { min: 130, max: 160, minutes: 22 },
  'פתח תקווה|נתב"ג': { min: 120, max: 150, minutes: 20 },
  'נתניה|נתב"ג': { min: 110, max: 140, minutes: 18 },
  "תל אביב|ירושלים": { min: 260, max: 320, minutes: 55 },
  "ראשון לציון|ירושלים": { min: 250, max: 310, minutes: 50 },
  "פתח תקווה|ירושלים": { min: 240, max: 300, minutes: 48 },
  "נתניה|ירושלים": { min: 280, max: 340, minutes: 60 },
  "תל אביב|חיפה": { min: 320, max: 390, minutes: 75 },
  "נתניה|חיפה": { min: 260, max: 320, minutes: 55 },
  "פתח תקווה|חיפה": { min: 300, max: 360, minutes: 70 },
  "ראשון לציון|חיפה": { min: 330, max: 400, minutes: 78 },
  "תל אביב|ראשון לציון": { min: 90, max: 120, minutes: 18 },
  "תל אביב|פתח תקווה": { min: 95, max: 125, minutes: 20 },
  "תל אביב|נתניה": { min: 130, max: 165, minutes: 30 },
  "ראשון לציון|תל אביב": { min: 90, max: 120, minutes: 18 },
  "פתח תקווה|תל אביב": { min: 95, max: 125, minutes: 20 },
  "נתניה|תל אביב": { min: 130, max: 165, minutes: 30 },
};

function normalize(value) {
  return value.trim().replace(/\s+/g, " ");
}

function routeKey(origin, destination) {
  return `${normalize(origin)}|${normalize(destination)}`;
}

export function estimateFare(origin, destination) {
  const from = normalize(origin);
  const to = normalize(destination);

  if (!from || !to) {
    return { error: "נא לבחור עיר מוצא ויעד." };
  }

  if (from === to) {
    return { error: "עיר המוצא והיעד זהות — בחרו יעד שונה." };
  }

  const direct = routeTable[routeKey(from, to)] ?? routeTable[routeKey(to, from)];
  if (direct) {
    return { origin: from, destination: to, ...direct };
  }

  const fallbackMinutes = Math.min(120, 25 + Math.max(from.length, to.length) * 3);
  const base = 80 + fallbackMinutes * 2;
  return {
    origin: from,
    destination: to,
    min: base,
    max: base + 35,
    minutes: fallbackMinutes,
    approximate: true,
  };
}

export function formatEstimate(result) {
  if (result.error) {
    return { price: "—", time: "—" };
  }
  return {
    price: `${result.min}-${result.max} ₪`,
    time: `כ-${result.minutes} דקות`,
  };
}

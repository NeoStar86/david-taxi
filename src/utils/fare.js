function normalize(value) {
  return value.trim().replace(/\s+/g, " ");
}

function routeKey(origin, destination) {
  return `${normalize(origin)}|${normalize(destination)}`;
}

export function estimateFareFromRoutes(routes, origin, destination) {
  const from = normalize(origin);
  const to = normalize(destination);

  if (!from || !to) {
    return { error: "נא לבחור עיר מוצא ויעד." };
  }

  if (from === to) {
    return { error: "עיר המוצא והיעד זהות — בחרו יעד שונה." };
  }

  const direct = routes.find(
    (route) => routeKey(route.origin, route.destination) === routeKey(from, to),
  );
  const reverse = routes.find(
    (route) => routeKey(route.origin, route.destination) === routeKey(to, from),
  );
  const match = direct ?? reverse;

  if (match) {
    return {
      origin: from,
      destination: to,
      min: Number(match.min),
      max: Number(match.max),
      minutes: Number(match.minutes),
    };
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

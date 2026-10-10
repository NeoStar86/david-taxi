function normalize(value) {
  return value.trim().replace(/\s+/g, " ");
}

function routeKey(origin, destination) {
  return `${normalize(origin)}|${normalize(destination)}`;
}

function applySurge(result, surge) {
  if (result.errorKey || !surge?.enabled) {
    return result;
  }
  const percent = Number(surge.percent) || 0;
  if (percent <= 0) {
    return result;
  }
  const factor = 1 + percent / 100;
  return {
    ...result,
    min: Math.round(result.min * factor),
    max: Math.round(result.max * factor),
    surgeApplied: true,
    surgePercent: percent,
  };
}

function applyVehicleMultiplier(result, multiplier) {
  if (result.errorKey) {
    return result;
  }
  const factor = Number(multiplier) || 1;
  if (factor <= 0 || factor === 1) {
    return result;
  }
  return {
    ...result,
    min: Math.round(result.min * factor),
    max: Math.round(result.max * factor),
    vehicleMultiplier: factor,
  };
}

export function estimateFareFromRoutes(routes, origin, destination, surge, vehicleMultiplier = 1) {
  const from = normalize(origin);
  const to = normalize(destination);

  if (!from || !to) {
    return { errorKey: "calc.errors.pickRoute" };
  }

  if (from === to) {
    return { errorKey: "calc.errors.sameCity" };
  }

  const direct = routes.find(
    (route) => routeKey(route.origin, route.destination) === routeKey(from, to),
  );
  const reverse = routes.find(
    (route) => routeKey(route.origin, route.destination) === routeKey(to, from),
  );
  const match = direct ?? reverse;

  let baseResult;
  if (match) {
    baseResult = {
      origin: from,
      destination: to,
      min: Number(match.min),
      max: Number(match.max),
      minutes: Number(match.minutes),
    };
  } else {
    const fallbackMinutes = Math.min(120, 25 + Math.max(from.length, to.length) * 3);
    const base = 80 + fallbackMinutes * 2;
    baseResult = {
      origin: from,
      destination: to,
      min: base,
      max: base + 35,
      minutes: fallbackMinutes,
      approximate: true,
    };
  }

  return applyVehicleMultiplier(applySurge(baseResult, surge), vehicleMultiplier);
}

export function formatEstimate(result, t) {
  if (result.errorKey) {
    return { price: "—", time: "—", errorKey: result.errorKey };
  }
  return {
    price: `${result.min}-${result.max} ₪`,
    time: t ? t("calc.minutes", { n: result.minutes }) : `~${result.minutes} min`,
  };
}

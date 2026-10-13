import { mergeVehicles } from "../data/defaultVehicles";
import { normalizeRides } from "./rides";
import { SUPPORTED_LANGS } from "../i18n/translations";
import { createDefaultSiteState } from "./defaults";

function mergeCmsHero(defaultsHero, storedHero) {
  const hero = {};
  for (const lang of SUPPORTED_LANGS) {
    hero[lang] = { ...defaultsHero[lang], ...storedHero?.[lang] };
  }
  return hero;
}

export const STORAGE_KEY = "david-taxi-site-data-v1";

export function mergeStoredSitePayload(defaults, parsed) {
  if (!parsed || typeof parsed !== "object") return defaults;
  const { availability: _legacyAvailability, rides: _rides, static: _static, ...stored } = parsed;

  return {
    ...defaults,
    ...stored,
    site: { ...defaults.site, ...parsed.site },
    media: { ...defaults.media, ...parsed.media },
    announcement: { ...defaults.announcement, ...parsed.announcement },
    analytics: { ...defaults.analytics, ...parsed.analytics },
    theme: { ...defaults.theme, ...parsed.theme },
    cms: {
      ...defaults.cms,
      ...parsed.cms,
      hero: mergeCmsHero(defaults.cms.hero, parsed.cms?.hero),
    },
    vehicles: mergeVehicles(parsed.vehicles),
    fare: {
      ...defaults.fare,
      ...parsed.fare,
      routes: parsed.fare?.routes?.length ? parsed.fare.routes : defaults.fare.routes,
      surge: { ...defaults.fare.surge, ...parsed.fare?.surge },
    },
    testimonials: parsed.testimonials?.length ? parsed.testimonials : defaults.testimonials,
    leads: parsed.leads ?? [],
    rides: normalizeRides(parsed.rides ?? []),
    static: defaults.static,
  };
}

export function loadSiteState() {
  const defaults = createDefaultSiteState();
  if (typeof window === "undefined") return defaults;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return mergeStoredSitePayload(defaults, parsed);
  } catch {
    return defaults;
  }
}

export function saveSiteState(state) {
  const { availability: _removed, ...persisted } = state;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
}

export function createLead({ source, payload }) {
  return {
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: "חדש",
    source,
    payload,
  };
}

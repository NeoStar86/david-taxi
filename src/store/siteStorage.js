import { createDefaultSiteState } from "./defaults";

export const STORAGE_KEY = "david-taxi-site-data-v1";

export function loadSiteState() {
  const defaults = createDefaultSiteState();
  if (typeof window === "undefined") return defaults;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return {
      ...defaults,
      ...parsed,
      site: { ...defaults.site, ...parsed.site },
      media: { ...defaults.media, ...parsed.media },
      availability: { ...defaults.availability, ...parsed.availability },
      fare: {
        ...defaults.fare,
        ...parsed.fare,
        routes: parsed.fare?.routes?.length ? parsed.fare.routes : defaults.fare.routes,
      },
      testimonials: parsed.testimonials?.length ? parsed.testimonials : defaults.testimonials,
      leads: parsed.leads ?? [],
      static: defaults.static,
    };
  } catch {
    return defaults;
  }
}

export function saveSiteState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

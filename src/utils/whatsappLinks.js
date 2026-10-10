import { t as translate } from "../i18n/translations";
import { loadSiteState } from "../store/siteStorage";

function getSite() {
  return loadSiteState().site;
}

function getLang() {
  if (typeof window === "undefined") return "he";
  return localStorage.getItem("site_lang") || "he";
}

export function openWhatsApp(text) {
  const site = getSite();
  const url = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function buildFareWhatsAppMessage(
  { origin, destination, min, max, minutes, vehicleLabel },
  lang = "he",
) {
  const tr = (key, vars) => translate(lang, key, vars);
  return [
    tr("wa.fareIntro"),
    "",
    `*${tr("wa.origin")}:* ${origin}`,
    `*${tr("wa.destination")}:* ${destination}`,
    vehicleLabel ? `*${tr("wa.vehicle")}:* ${vehicleLabel}` : "",
    `*${tr("wa.price")}:* ${min}-${max} ₪`,
    `*${tr("wa.eta")}:* ${tr("calc.minutes", { n: minutes })}`,
    "",
    tr("wa.closing"),
  ]
    .filter(Boolean)
    .join("\n");
}

export function openLocationShareWhatsApp(lang = getLang()) {
  openWhatsApp(translate(lang, "locationShare.message"));
}

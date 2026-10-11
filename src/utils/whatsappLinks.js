import { t as translate } from "../i18n/translations";
import { DEFAULT_FARE_WHATSAPP_TEMPLATE } from "../constants/fareWhatsAppTemplate";
import { loadSiteState } from "../store/siteStorage";

export { DEFAULT_FARE_WHATSAPP_TEMPLATE };

function getSite() {
  return loadSiteState().site;
}

function getFareSettings() {
  return loadSiteState().fare ?? {};
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

export function applyFareWhatsAppTemplate(
  template,
  { origin, destination, min, max, minutes, vehicleLabel },
  lang = "he",
) {
  const tr = (key, vars) => translate(lang, key, vars);
  const minutesLabel = tr("calc.minutes", { n: minutes });
  const vehicle = vehicleLabel || "—";

  return String(template ?? "")
    .replaceAll("{{origin}}", origin ?? "")
    .replaceAll("{{destination}}", destination ?? "")
    .replaceAll("{{vehicle}}", vehicle)
    .replaceAll("{{min}}", String(min ?? ""))
    .replaceAll("{{max}}", String(max ?? ""))
    .replaceAll("{{minutes}}", minutesLabel)
    .trim();
}

export function buildFareWhatsAppMessage(
  { origin, destination, min, max, minutes, vehicleLabel },
  lang = "he",
  customTemplate,
) {
  const template =
    customTemplate?.trim() ||
    getFareSettings().whatsappTemplate?.trim() ||
    DEFAULT_FARE_WHATSAPP_TEMPLATE;

  if (template) {
    return applyFareWhatsAppTemplate(
      template,
      { origin, destination, min, max, minutes, vehicleLabel },
      lang,
    );
  }

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

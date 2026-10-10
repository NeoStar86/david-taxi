import { SUPPORTED_LANGS } from "../i18n/translations";
import { uiStrings } from "../i18n/uiStrings";

/** CMS copy seeded from i18n defaults — editable in admin, rendered on site. */
export function createDefaultCms() {
  const hero = {};
  for (const lang of SUPPORTED_LANGS) {
    const copy = uiStrings[lang];
    hero[lang] = {
      title: copy.hero_title,
      subtitle: copy.hero_subtitle,
      badge: copy.badge_text,
      address: copy.hero_address,
      selectVehiclePrompt: copy.select_vehicle_prompt,
    };
  }
  return { hero };
}

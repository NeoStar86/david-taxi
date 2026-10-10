import { MapPinned } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { openLocationShareWhatsApp } from "../utils/whatsappLinks";

export default function ShareLocationButton({ className = "", fullWidth = false }) {
  const { lang, t } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => openLocationShareWhatsApp(lang)}
      className={`btn-secondary min-h-12 px-5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      <MapPinned className="h-5 w-5 text-gold" strokeWidth={2.2} aria-hidden="true" />
      {t("common.shareLocation")}
    </button>
  );
}

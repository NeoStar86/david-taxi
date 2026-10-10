import { useLanguage } from "../context/LanguageContext";
import { useSiteData } from "../context/SiteDataContext";
import { PhoneIcon } from "./Icons";

const sizes = {
  md: "min-h-12 px-4 text-sm sm:px-5",
  lg: "min-h-14 px-6 text-base sm:px-7",
};

export default function CallNow({ size = "md", className = "" }) {
  const { data, recordClick } = useSiteData();
  const { t } = useLanguage();
  const { site } = data;

  return (
    <a
      href={`tel:${site.phoneTel}`}
      onClick={() => recordClick("call")}
      className={`btn-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${sizes[size]} ${className}`}
    >
      <PhoneIcon />
      {t("nav.call")}
    </a>
  );
}

export function WhatsAppButton({ size = "lg", className = "" }) {
  const { data, recordClick } = useSiteData();
  const { t } = useLanguage();
  const { site } = data;

  return (
    <a
      href={`https://wa.me/${site.whatsapp}`}
      onClick={() => recordClick("whatsapp")}
      className={`btn-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${sizes[size]} ${className}`}
    >
      <span className="text-[#25D366]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2Zm5.78 13.95c-.24.68-1.4 1.3-1.93 1.38-.49.07-1.1.1-1.78-.11-.41-.13-.94-.3-1.62-.59-2.85-1.23-4.7-4.1-4.84-4.29-.14-.19-1.15-1.53-1.15-2.92s.73-2.07 1-2.35c.24-.26.64-.38.85-.38.21 0 .43 0 .61.01.2.01.46-.07.72.55.27.64.9 2.2.98 2.36.08.16.13.35.03.56-.1.21-.15.34-.3.52-.15.18-.31.4-.44.54-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.3.15.47.13.64-.08.17-.2.73-.85.93-1.14.2-.3.39-.24.66-.14.27.1 1.7.8 1.99.95.29.14.48.21.55.33.07.12.07.68-.17 1.36Z"
          />
        </svg>
      </span>
      {t("nav.whatsapp")}
    </a>
  );
}

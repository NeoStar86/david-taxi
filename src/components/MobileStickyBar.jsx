import { MapPinned, MessageCircle, Phone } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useSiteData } from "../context/SiteDataContext";
import { openLocationShareWhatsApp } from "../utils/whatsappLinks";

export default function MobileStickyBar() {
  const { data, recordClick } = useSiteData();
  const { site } = data;
  const { lang, t } = useLanguage();

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label={t("mobile.quickActions")}
    >
      <button
        type="button"
        onClick={() => openLocationShareWhatsApp(lang)}
        className="flex min-h-12 w-full items-center justify-center gap-2 border-b border-white/10 bg-ink-soft/95 px-4 text-sm font-bold text-cream transition active:bg-white/5"
      >
        <MapPinned className="h-5 w-5 text-gold" strokeWidth={2.2} aria-hidden="true" />
        {t("mobile.shareLocation")}
      </button>
      <div className="flex h-14">
        <a
          href={`tel:${site.phoneTel}`}
          onClick={() => recordClick("call")}
          className="flex min-h-14 flex-1 items-center justify-center gap-2 bg-gold text-base font-extrabold text-ink transition active:bg-gold-deep"
        >
          <Phone className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
          {t("nav.call")}
        </a>
        <a
          href={`https://wa.me/${site.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => recordClick("whatsapp")}
          className="flex min-h-14 flex-1 items-center justify-center gap-2 bg-[#25D366] text-base font-extrabold text-white transition active:bg-[#1da851]"
        >
          <MessageCircle className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}

import { agencyConfig, getAgencyWhatsAppUrl } from "../agencyConfig";
import { useLanguage } from "../context/LanguageContext";
import { useSiteData } from "../context/SiteDataContext";
import SaveContactButton from "./SaveContactButton";

function AgencyCreditLine() {
  const { agencyName, tagline } = agencyConfig;
  const segments = tagline.split(agencyName);

  if (segments.length < 2) {
    return tagline;
  }

  return (
    <>
      {segments[0]}
      <a
        href={getAgencyWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold text-gold transition hover:underline"
      >
        {agencyName}
      </a>
      {segments.slice(1).join(agencyName)}
    </>
  );
}

export default function Footer() {
  const { data, recordClick } = useSiteData();
  const { site } = data;
  const { t } = useLanguage();

  return (
    <footer className="border-t border-white/10 bg-ink pb-32 text-cream md:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-cream/80">{t("footer.rights")}</p>
            <p className="text-xs leading-relaxed text-cream/55">
              <AgencyCreditLine />
            </p>
            {agencyConfig.websiteUrl && agencyConfig.websiteUrl !== "https://your-domain.com" && (
              <a
                href={agencyConfig.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs text-cream/50 hover:text-gold"
              >
                {agencyConfig.websiteUrl.replace(/^https?:\/\//, "")}
              </a>
            )}
            <SaveContactButton />
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream/70">
            <a
              href={`tel:${site.phoneTel}`}
              onClick={() => recordClick("call")}
              className="font-semibold hover:text-gold"
            >
              {site.phoneDisplay}
            </a>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => recordClick("whatsapp")}
              className="hover:text-gold"
            >
              WhatsApp
            </a>
            {site.email && (
              <a href={`mailto:${site.email}`} className="hover:text-gold">
                {site.email}
              </a>
            )}
            <span>{site.hours}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

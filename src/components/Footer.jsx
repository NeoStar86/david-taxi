import { site } from "../content";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink pb-20 text-cream md:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-cream/80">
            © דוד מוניות והסעות - כל הזכויות שמורות
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream/70">
            <a href={`tel:${site.phoneTel}`} className="font-semibold hover:text-gold">
              {site.phoneDisplay}
            </a>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold"
            >
              WhatsApp
            </a>
            <span>{site.hours}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

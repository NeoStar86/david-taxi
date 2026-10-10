import { MapPinned, MessageCircle, Phone } from "lucide-react";
import { site } from "../content";
import { openLocationShareWhatsApp } from "../utils/whatsappLinks";

export default function MobileStickyBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="פעולות מהירות"
    >
      <button
        type="button"
        onClick={openLocationShareWhatsApp}
        className="flex min-h-12 w-full items-center justify-center gap-2 border-b border-white/10 bg-ink-soft/95 px-4 text-sm font-bold text-cream transition active:bg-white/5"
      >
        <MapPinned className="h-5 w-5 text-gold" strokeWidth={2.2} aria-hidden="true" />
        שתף מיקום איסוף ב-WhatsApp
      </button>
      <div className="flex h-14">
        <a
          href={`tel:${site.phoneTel}`}
          className="flex min-h-14 flex-1 items-center justify-center gap-2 bg-gold text-base font-extrabold text-ink transition active:bg-gold-deep"
        >
          <Phone className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
          חייג עכשיו
        </a>
        <a
          href={`https://wa.me/${site.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-14 flex-1 items-center justify-center gap-2 bg-[#25D366] text-base font-extrabold text-white transition active:bg-[#1da851]"
        >
          <MessageCircle className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}

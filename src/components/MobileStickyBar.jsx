import { MessageCircle, Phone } from "lucide-react";
import { site } from "../content";

export default function MobileStickyBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="פעולות מהירות"
    >
      <div className="flex h-16">
        <a
          href={`tel:${site.phoneTel}`}
          className="flex flex-1 items-center justify-center gap-2 bg-gold text-base font-extrabold text-ink transition active:bg-gold-deep"
        >
          <Phone className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
          חייג עכשיו
        </a>
        <a
          href={`https://wa.me/${site.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 bg-[#25D366] text-base font-extrabold text-white transition active:bg-[#1da851]"
        >
          <MessageCircle className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}

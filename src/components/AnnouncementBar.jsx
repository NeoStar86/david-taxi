import { Megaphone } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext";

export default function AnnouncementBar() {
  const { data } = useSiteData();
  const { announcement } = data;

  if (!announcement?.enabled || !announcement.message?.trim()) {
    return null;
  }

  return (
    <div
      className="relative z-[60] border-b border-gold/35 bg-gradient-to-l from-gold/25 via-ink to-gold/15 text-cream shadow-[0_4px_24px_rgba(245,197,24,0.12)]"
      role="region"
      aria-label="הודעת מערכת"
    >
      <div className="mx-auto flex min-h-11 max-w-6xl items-center justify-center gap-2 px-4 py-2.5 sm:px-6">
        <Megaphone className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
        <p className="text-center text-sm font-bold leading-snug tracking-wide sm:text-[15px]">
          {announcement.message.trim()}
        </p>
      </div>
    </div>
  );
}

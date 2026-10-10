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
      className="relative z-[60] overflow-hidden border-b border-gold/30 bg-gradient-to-l from-gold/20 via-gold/10 to-gold/20 text-cream"
      role="region"
      aria-label="הודעת מבצע"
    >
      <div className="flex min-h-10 items-center gap-2 px-4 py-2 sm:px-6">
        <Megaphone className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
        <p className="animate-marquee whitespace-nowrap text-sm font-bold tracking-wide">
          {announcement.message.trim()}
        </p>
      </div>
    </div>
  );
}

import { useSiteData } from "../context/SiteDataContext";

export default function AvailabilityBadge() {
  const { data } = useSiteData();
  const available = data.availability.isAvailable;

  return (
    <div
      className={`fixed bottom-24 start-4 z-30 rounded-full border px-4 py-2 text-xs font-extrabold shadow-lg backdrop-blur md:bottom-6 ${
        available
          ? "border-gold/40 bg-gold/15 text-gold"
          : "border-red-400/40 bg-red-500/15 text-red-200"
      }`}
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {available ? "זמין כעת נסיעות" : "לא זמין כעת"}
    </div>
  );
}

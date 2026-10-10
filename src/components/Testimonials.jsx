import { Quote, Star } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext";

function StarRating({ rating }) {
  const stars = Math.max(1, Math.min(5, Number(rating) || 5));
  return (
    <div className="flex gap-0.5" aria-label={`דירוג ${stars} כוכבים`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 sm:h-[18px] sm:w-[18px] ${
            index < stars ? "fill-gold text-gold drop-shadow-[0_0_8px_rgba(245,197,24,0.45)]" : "text-white/20"
          }`}
          strokeWidth={0}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { data } = useSiteData();
  const items = data.testimonials.filter((item) => item.visible !== false);

  return (
    <section id="testimonials" className="relative overflow-hidden bg-ink-soft py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,197,24,0.08),transparent_45%)]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-kicker">לקוחות ממליצים</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
            אמון שנבנה נסיעה אחר נסיעה
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-cream/70">
            ביקורות אמיתיות מלקוחות שנהנו מנסיעה בטוחה, נוחה ובזמן.
          </p>
        </div>

        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <figure
              key={item.id}
              className="glass-card glass-card-hover group relative flex min-w-[88%] shrink-0 snap-center flex-col p-6 sm:min-w-[72%] sm:p-8 lg:min-w-0"
            >
              <div className="absolute start-5 top-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/25 bg-gold/10">
                <Quote className="h-5 w-5 text-gold" strokeWidth={2} aria-hidden="true" />
              </div>

              <div className="mt-14">
                <StarRating rating={item.rating} />
                <blockquote className="mt-4 text-base leading-relaxed text-cream/92 sm:text-[17px]">
                  “{item.quote}”
                </blockquote>
              </div>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-xs font-extrabold text-gold">
                  {item.name.charAt(0)}
                </span>
                <span className="text-sm font-extrabold text-gold">{item.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

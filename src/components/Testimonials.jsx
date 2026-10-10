import { Quote, Star } from "lucide-react";
import { testimonials } from "../content";

function StarRating() {
  return (
    <div className="flex gap-0.5" aria-label="דירוג 5 כוכבים">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className="h-4 w-4 fill-gold text-gold sm:h-[18px] sm:w-[18px]"
          strokeWidth={0}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-ink-soft py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold text-gold">לקוחות ממליצים</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
            מה אומרים אחרי הנסיעה
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-cream/70">
            ביקורות אמיתיות מלקוחות שנהנו מנסיעה בטוחה, נוחה ובזמן.
          </p>
        </div>

        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
          {testimonials.map((item) => (
            <figure
              key={item.name}
              className="group relative flex min-w-[85%] shrink-0 snap-center flex-col rounded-3xl border border-white/10 bg-panel p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:border-gold/35 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:min-w-[70%] sm:p-8 md:min-w-0"
            >
              <Quote
                className="absolute start-6 top-6 h-10 w-10 text-gold/20 transition group-hover:text-gold/35"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <div className="relative mt-8">
                <StarRating />
                <blockquote className="mt-4 text-base leading-relaxed text-cream/90 sm:text-[17px]">
                  “{item.quote}”
                </blockquote>
              </div>
              <figcaption className="relative mt-6 border-t border-white/10 pt-4 text-sm font-extrabold text-gold">
                {item.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

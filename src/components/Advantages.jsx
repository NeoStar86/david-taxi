import {
  Clock,
  CreditCard,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { advantages } from "../content";

const icons = {
  clock: Clock,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  "credit-card": CreditCard,
};

export default function Advantages() {
  return (
    <section id="advantages" className="relative overflow-hidden bg-ink py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,197,24,0.08),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-gold/40 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="section-kicker">למה לבחור בדוד?</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
            היתרונות שמבדילים אותנו
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {advantages.map((item) => {
            const Icon = icons[item.icon];
            return (
              <article
                key={item.title}
                className="glass-card glass-card-hover p-6 sm:p-7"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  <Icon className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-cream">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/70">{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

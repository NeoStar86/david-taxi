import {
  Crown,
  MapPin,
  Package,
  Plane,
} from "lucide-react";
import { services } from "../content";

const icons = {
  plane: Plane,
  "map-pin": MapPin,
  crown: Crown,
  package: Package,
};

export default function Services() {
  return (
    <section id="services" className="bg-ink-soft py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold text-gold">השירותים שלנו</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
            מה אנחנו מציעים
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-cream/70">
            מוניות והסעות מותאמות אישית — מנתב״ג ועד אירועים, בכל הארץ.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => {
            const Icon = icons[service.icon];
            return (
              <article
                key={service.title}
                className="group flex h-full flex-col rounded-3xl border border-white/10 bg-panel p-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-gold/35 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-7"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-gold transition group-hover:bg-gold group-hover:text-ink">
                  <Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-extrabold leading-snug text-cream">{service.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-cream/70 sm:text-[15px]">
                  {service.description}
                </p>
                <a
                  href="#contact"
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-gold/40 px-4 text-sm font-bold text-gold transition hover:border-gold hover:bg-gold hover:text-ink"
                >
                  להזמנת שירות זה
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

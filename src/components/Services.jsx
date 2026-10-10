import { Crown, MapPin, Package, Plane } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const icons = {
  plane: Plane,
  "map-pin": MapPin,
  crown: Crown,
  package: Package,
};

export default function Services() {
  const { t, content } = useLanguage();
  const services = content.services;

  return (
    <section id="services" className="bg-ink-soft py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="section-kicker">{t("services.kicker")}</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">{t("services.title")}</h2>
          <p className="mt-4 text-lg leading-relaxed text-cream/70">{t("services.subtitle")}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => {
            const Icon = icons[service.icon];
            return (
              <article
                key={service.title}
                className="glass-card glass-card-hover group flex h-full flex-col p-6 sm:p-7"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-gold transition group-hover:bg-gold group-hover:text-ink">
                  <Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-extrabold leading-snug text-cream">{service.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-cream/70 sm:text-[15px]">
                  {service.description}
                </p>
                <a href="#contact" className="btn-outline-gold mt-6 min-h-11 px-4 text-sm">
                  {t("services.cta")}
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

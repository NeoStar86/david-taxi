import { useLanguage } from "../context/LanguageContext";

export default function Areas() {
  const { t, content } = useLanguage();
  const areaTags = content.areaTags;

  return (
    <section id="areas" className="border-y border-white/5 bg-panel py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="section-kicker">{t("areas.kicker")}</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-cream sm:text-3xl">{t("areas.title")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-cream/65">{t("areas.subtitle")}</p>
        </div>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {areaTags.map((tag) => (
            <li key={tag}>
              <span className="glass-card inline-flex rounded-full px-5 py-2.5 text-sm font-bold text-cream transition hover:border-gold/45">
                {tag}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

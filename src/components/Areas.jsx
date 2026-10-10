import { areaTags } from "../content";

export default function Areas() {
  return (
    <section id="areas" className="border-y border-white/5 bg-panel py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="section-kicker">אזורי פעילות</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-cream sm:text-3xl">
            איפה אנחנו מגיעים
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-cream/65">
            כיסוי רחב באזורי המרכז, השרון, ירושלים, השפלה ונתב״ג.
          </p>
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

import { LOCALE_META, SUPPORTED_LANGS } from "../i18n/translations";

const inputClass =
  "mt-2 w-full min-h-12 rounded-xl border border-white/15 bg-ink/80 px-4 py-3 text-base outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

function Help({ children }) {
  return <p className="mt-1 text-xs leading-relaxed text-cream/55">{children}</p>;
}

export default function AdminCmsHeroPanel({ draft, setDraft, persist }) {
  function patchHero(lang, field, value) {
    setDraft((current) => ({
      ...current,
      cms: {
        ...current.cms,
        hero: {
          ...current.cms.hero,
          [lang]: {
            ...current.cms.hero?.[lang],
            [field]: value,
          },
        },
      },
    }));
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-ink/40 p-4 sm:col-span-2">
      <h3 className="text-lg font-extrabold">תוכן Hero לפי שפה (CMS)</h3>
      <Help>טקסטים אלו מוצגים בראש העמוד הראשי ומתעדכנים לפי שפת המבקר.</Help>

      <div className="mt-4 space-y-6">
        {SUPPORTED_LANGS.map((lang) => {
          const hero = draft.cms?.hero?.[lang] ?? {};
          return (
            <div key={lang} className="rounded-xl border border-white/10 p-4">
              <p className="text-sm font-extrabold text-gold">{LOCALE_META[lang].label}</p>
              <div className="mt-3 grid gap-3">
                <label className="block">
                  <span className="text-xs font-bold">תגית עליונה (Badge)</span>
                  <input
                    className={inputClass}
                    value={hero.badge ?? ""}
                    onChange={(event) => patchHero(lang, "badge", event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold">כותרת ראשית</span>
                  <input
                    className={inputClass}
                    value={hero.title ?? ""}
                    onChange={(event) => patchHero(lang, "title", event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold">תת-כותרת</span>
                  <textarea
                    rows={2}
                    className={`${inputClass} min-h-[80px] resize-y`}
                    value={hero.subtitle ?? ""}
                    onChange={(event) => patchHero(lang, "subtitle", event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold">שורת אזור שירות</span>
                  <input
                    className={inputClass}
                    value={hero.address ?? ""}
                    onChange={(event) => patchHero(lang, "address", event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold">טקסט בחירת רכב</span>
                  <input
                    className={inputClass}
                    value={hero.selectVehiclePrompt ?? ""}
                    onChange={(event) => patchHero(lang, "selectVehiclePrompt", event.target.value)}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <button type="button" className="btn-primary mt-4 min-h-12 px-6" onClick={() => persist(draft)}>
        שמור תוכן Hero
      </button>
    </div>
  );
}

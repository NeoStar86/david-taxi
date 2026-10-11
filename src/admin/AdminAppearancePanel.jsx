import { THEME_PRESETS, createDefaultTheme } from "../store/defaultTheme";
import { applyTheme } from "../utils/applyTheme";

const inputClass =
  "mt-2 w-full min-h-12 rounded-xl border border-white/15 bg-ink/80 px-4 py-3 text-base outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

function Help({ children }) {
  return <p className="mt-1 text-xs leading-relaxed text-cream/55">{children}</p>;
}

export default function AdminAppearancePanel({ draft, setDraft, persist }) {
  const theme = draft.theme ?? {};

  function patchTheme(patch) {
    setDraft((current) => ({
      ...current,
      theme: { ...current.theme, ...patch },
    }));
  }

  function resetThemeToDefault() {
    const confirmed = window.confirm(
      "לאפס את כל הגדרות העיצוב לברירת המחדל (מצב כהה, זהב ושחור)? השינוי יישמר מיד באתר.",
    );
    if (!confirmed) return;

    const defaultTheme = createDefaultTheme();
    applyTheme(defaultTheme);
    const nextDraft = { ...draft, theme: { ...defaultTheme } };
    setDraft(nextDraft);
    persist(nextDraft);
  }

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-extrabold">עיצוב ונראות</h2>
      <p className="text-sm text-cream/65">שינויי צבע חלים מיד על כל האתר (כפתורים, הדגשות, רקעים).</p>

      <div className="rounded-2xl border border-white/10 bg-ink/40 p-4">
        <p className="text-sm font-extrabold">מצב תצוגה</p>
        <Help>בוחרים בין מצב כהה לבהיר לכל דפי האתר.</Help>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { id: "dark", label: "מצב כהה" },
            { id: "light", label: "מצב בהיר" },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => patchTheme({ mode: mode.id })}
              className={`min-h-11 rounded-full px-4 text-sm font-bold ${
                theme.mode === mode.id ? "bg-gold text-ink" : "border border-white/15 bg-white/5"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink/40 p-4">
        <p className="text-sm font-extrabold">צבע ראשי (כפתורים / הדגשות)</p>
        <Help>משפיע על כפתורי חיוג, קווים מודגשים, כוכבים ואלמנטי זהב באתר.</Help>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(THEME_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              type="button"
              onClick={() => patchTheme({ accent: preset.accent, accentDeep: preset.accentDeep })}
              className="min-h-11 rounded-full border border-white/15 px-4 text-sm font-bold"
              style={{ backgroundColor: preset.accent, color: "#070708" }}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-bold">צבע ראשי</span>
            <input
              type="color"
              className="mt-2 h-12 w-full cursor-pointer rounded-xl border border-white/15 bg-transparent"
              value={theme.accent ?? "#f5c518"}
              onChange={(event) => patchTheme({ accent: event.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold">צבע ראשי (כהה)</span>
            <input
              type="color"
              className="mt-2 h-12 w-full cursor-pointer rounded-xl border border-white/15 bg-transparent"
              value={theme.accentDeep ?? "#d9a800"}
              onChange={(event) => patchTheme({ accentDeep: event.target.value })}
            />
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink/40 p-4">
        <p className="text-sm font-extrabold">רקעים</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-bold">רקע כותרת (Header)</span>
            <Help>צבע רקע סרגל הניווט העליון.</Help>
            <input
              type="color"
              className="mt-2 h-12 w-full cursor-pointer rounded-xl border border-white/15 bg-transparent"
              value={theme.headerBg ?? "#070708"}
              onChange={(event) => patchTheme({ headerBg: event.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold">רקע כרטיסים (Cards)</span>
            <Help>משפיע על כרטיסי זכוכית, מחשבון ותיבות תוכן.</Help>
            <input
              type="color"
              className="mt-2 h-12 w-full cursor-pointer rounded-xl border border-white/15 bg-transparent"
              value={theme.cardBg ?? "#16161f"}
              onChange={(event) => patchTheme({ cardBg: event.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold">רקע עמוד ראשי</span>
            <input
              type="color"
              className="mt-2 h-12 w-full cursor-pointer rounded-xl border border-white/15 bg-transparent"
              value={theme.pageBg ?? "#070708"}
              onChange={(event) => patchTheme({ pageBg: event.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold">רקע משני</span>
            <input
              type="color"
              className="mt-2 h-12 w-full cursor-pointer rounded-xl border border-white/15 bg-transparent"
              value={theme.pageBgSoft ?? "#121218"}
              onChange={(event) => patchTheme({ pageBgSoft: event.target.value })}
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button type="button" className="btn-primary min-h-12 px-6" onClick={() => persist(draft)}>
          שמור עיצוב
        </button>
        <button type="button" className="btn-outline-gold min-h-12 px-6" onClick={resetThemeToDefault}>
          איפוס לברירת מחדל
        </button>
      </div>
      <p className="text-xs text-cream/50">
        איפוס מחזיר את ערכת ברירת המחדל (Dark Luxury — זהב ושחור) ומעדכן את localStorage מיד.
      </p>
    </section>
  );
}

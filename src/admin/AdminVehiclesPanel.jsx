import { createBlankVehicle } from "../data/defaultVehicles";
import { LOCALE_META, SUPPORTED_LANGS } from "../i18n/translations";
import AdminImageField from "./AdminImageField";

const inputClass =
  "mt-2 w-full min-h-12 rounded-xl border border-white/15 bg-ink/80 px-4 py-3 text-base outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

function Help({ children }) {
  return <p className="mt-1 text-xs leading-relaxed text-cream/55">{children}</p>;
}

export default function AdminVehiclesPanel({
  draft,
  setDraft,
  persist,
  updateVehicleField,
  updateVehicleName,
}) {
  function updateVehicleSubtitle(vehicleId, lang, value) {
    setDraft((current) => ({
      ...current,
      vehicles: (current.vehicles ?? []).map((vehicle) =>
        vehicle.id === vehicleId
          ? { ...vehicle, subtitles: { ...vehicle.subtitles, [lang]: value } }
          : vehicle,
      ),
    }));
  }

  function removeVehicle(vehicleId) {
    setDraft((current) => ({
      ...current,
      vehicles: (current.vehicles ?? []).filter((vehicle) => vehicle.id !== vehicleId),
    }));
  }

  function addVehicle() {
    setDraft((current) => ({
      ...current,
      vehicles: [...(current.vehicles ?? []), createBlankVehicle()],
    }));
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold">ניהול כרטיסי רכב</h2>
          <Help>כל שינוי כאן משפקיע ישירות על רשת 4+ הרכבים בעמוד הבית ובמחשבון המחירים.</Help>
        </div>
        <button type="button" className="btn-outline-gold min-h-12 px-4 text-sm" onClick={addVehicle}>
          + הוספת סוג רכב
        </button>
      </div>

      {(draft.vehicles ?? []).map((vehicle) => (
        <article key={vehicle.id} className="rounded-2xl border border-white/10 bg-ink/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-extrabold text-gold">{vehicle.id}</p>
            <label className="flex items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                className="h-5 w-5 accent-gold"
                checked={vehicle.visible !== false}
                onChange={(event) => updateVehicleField(vehicle.id, { visible: event.target.checked })}
              />
              מוצג באתר
            </label>
          </div>
          <Help>כיבוי "מוצג באתר" מסתיר את הרכב מהעמוד הראשי והמחשבון.</Help>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {SUPPORTED_LANGS.map((lang) => (
              <label key={`name-${lang}`} className="block">
                <span className="text-xs font-bold text-cream/60">שם רכב ({LOCALE_META[lang].label})</span>
                <Help>כותרת הכרטיס בשפה {LOCALE_META[lang].label}.</Help>
                <input
                  className={inputClass}
                  value={vehicle.names?.[lang] ?? ""}
                  onChange={(event) => updateVehicleName(vehicle.id, lang, event.target.value)}
                />
              </label>
            ))}
            {SUPPORTED_LANGS.map((lang) => (
              <label key={`sub-${lang}`} className="block">
                <span className="text-xs font-bold text-cream/60">תת-כותרת / קיבולת ({LOCALE_META[lang].label})</span>
                <Help>טקסט קטן מתחת לשם — לדוגמה "עד 6 נוסעים". אם ריק, יוצג מונה הנוסעים.</Help>
                <input
                  className={inputClass}
                  value={vehicle.subtitles?.[lang] ?? ""}
                  onChange={(event) => updateVehicleSubtitle(vehicle.id, lang, event.target.value)}
                />
              </label>
            ))}
            <label className="block">
              <span className="text-xs font-bold text-cream/60">קיבולת נוסעים (מספר)</span>
              <Help>משמש לתצוגת "עד X נוסעים" כשאין תת-כותרת.</Help>
              <input
                type="number"
                min={1}
                className={inputClass}
                value={vehicle.capacity}
                onChange={(event) =>
                  updateVehicleField(vehicle.id, { capacity: Number(event.target.value) })
                }
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-cream/60">מכפיל מחיר בסיס</span>
              <Help>1 = מחיר רגיל. 1.25 מעלה את האומדן ב-25% במחשבון וב-WhatsApp.</Help>
              <input
                type="number"
                min={0.5}
                step={0.05}
                className={inputClass}
                value={vehicle.multiplier}
                onChange={(event) =>
                  updateVehicleField(vehicle.id, { multiplier: Number(event.target.value) })
                }
              />
            </label>
          </div>

          <div className="mt-4">
            <AdminImageField
              label="תמונת רכב"
              value={vehicle.image ?? ""}
              onUpdate={(value, options) => updateVehicleField(vehicle.id, { image: value }, options)}
            />
            <Help>תמונה זו תופיע בריבוע הרכב בעמוד הבית ובבחירת הרכב.</Help>
          </div>

          <button
            type="button"
            className="btn-outline-gold mt-4 min-h-11 px-4 text-sm text-gold"
            onClick={() => removeVehicle(vehicle.id)}
          >
            מחיקת רכב
          </button>
        </article>
      ))}

      <button type="button" className="btn-primary min-h-12 px-6" onClick={() => persist(draft)}>
        שמור רכבים
      </button>
    </section>
  );
}

import { agencyConfig } from "../agencyConfig";
import { DEFAULT_FARE_WHATSAPP_TEMPLATE } from "../utils/whatsappLinks";

const inputClass =
  "mt-2 w-full min-h-12 rounded-xl border border-white/15 bg-ink/80 px-4 py-3 text-base outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

const PLACEHOLDERS = ["{{origin}}", "{{destination}}", "{{vehicle}}", "{{min}}", "{{max}}", "{{minutes}}"];

export default function AdminSettingsPanel({ draft, setDraft, persist }) {
  const template = draft.fare?.whatsappTemplate ?? DEFAULT_FARE_WHATSAPP_TEMPLATE;

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-xl font-extrabold">הגדרות מערכת</h2>
        <p className="mt-1 text-sm text-cream/60">באנר עליון, תבנית WhatsApp למחשבון, ומידע על מיתוג קבוע.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink/40 p-4 sm:p-5">
        <h3 className="text-base font-extrabold">הודעת מערכת / באנר עליון</h3>
        <p className="mt-1 text-xs text-cream/55">מוצג בראש האתר הציבורי כשהמצב פעיל.</p>
        <label className="mt-4 flex items-center gap-3">
          <input
            type="checkbox"
            className="h-5 w-5 accent-gold"
            checked={Boolean(draft.announcement?.enabled)}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                announcement: { ...current.announcement, enabled: event.target.checked },
              }))
            }
          />
          <span className="text-sm font-bold">הפעלת באנר עליון</span>
        </label>
        <label className="mt-3 block">
          <span className="text-xs font-bold text-cream/60">טקסט ההודעה</span>
          <input
            className={inputClass}
            value={draft.announcement?.message ?? ""}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                announcement: { ...current.announcement, message: event.target.value },
              }))
            }
            placeholder='הזמנת מוניות לנתב"ג 24/7 • התחייבות להגעה בזמן'
          />
        </label>
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink/40 p-4 sm:p-5">
        <h3 className="text-base font-extrabold">תבנית הודעת WhatsApp — מחשבון מחירים</h3>
        <p className="mt-1 text-xs text-cream/55">
          נשלחת כשלקוח לוחץ על הזמנה ב-WhatsApp מהמחשבון. השתמש במשתנים:
        </p>
        <p className="mt-2 font-mono text-[11px] text-gold/90">{PLACEHOLDERS.join(" · ")}</p>
        <label className="mt-3 block">
          <span className="text-xs font-bold text-cream/60">תוכן ההודעה</span>
          <textarea
            className={`${inputClass} min-h-40 font-mono text-sm leading-relaxed`}
            dir="rtl"
            value={template}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                fare: { ...current.fare, whatsappTemplate: event.target.value },
              }))
            }
          />
        </label>
        <button
          type="button"
          className="btn-outline-gold mt-3 min-h-10 px-4 text-xs"
          onClick={() =>
            setDraft((current) => ({
              ...current,
              fare: { ...current.fare, whatsappTemplate: DEFAULT_FARE_WHATSAPP_TEMPLATE },
            }))
          }
        >
          שחזור לברירת מחדל
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink/30 p-4 sm:p-5">
        <h3 className="text-base font-extrabold">מיתוג סוכנות (נעול)</h3>
        <p className="mt-2 text-sm text-cream/65">
          קרדיט {agencyConfig.agencyName} בפוטר נמשך אך ורק מ-
          <code className="mx-1 rounded bg-black/30 px-1.5 py-0.5 text-xs">agencyConfig.js</code>
          ואינו ניתן לעריכה או הסתרה מלוח הבקרה.
        </p>
        <p className="mt-3 rounded-xl border border-dashed border-white/15 bg-black/20 px-3 py-2 text-xs text-cream/55">
          {agencyConfig.tagline}
        </p>
      </div>

      <button type="button" className="btn-primary min-h-12 px-6" onClick={() => persist(draft)}>
        שמור הגדרות
      </button>
    </section>
  );
}

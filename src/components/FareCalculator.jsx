import { Calculator, Clock3, Route } from "lucide-react";
import { useMemo, useState } from "react";
import {
  destinationSuggestions,
  estimateFare,
  formatEstimate,
  originSuggestions,
} from "../data/fareEstimates";
import { buildFareWhatsAppMessage, openWhatsApp } from "../utils/whatsappLinks";

const fieldClass =
  "mt-2 w-full min-h-12 rounded-xl border border-white/15 bg-ink/80 px-4 py-3 text-base text-cream outline-none transition placeholder:text-cream/35 focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

export default function FareCalculator() {
  const [origin, setOrigin] = useState("תל אביב");
  const [destination, setDestination] = useState('נתב"ג');

  const estimate = useMemo(() => estimateFare(origin, destination), [origin, destination]);
  const formatted = useMemo(() => formatEstimate(estimate), [estimate]);

  function handleWhatsAppOrder() {
    if (estimate.error) return;
    openWhatsApp(buildFareWhatsAppMessage(estimate));
  }

  return (
    <section id="calculator" className="relative overflow-hidden bg-ink py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(245,197,24,0.1),transparent_45%)]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="section-kicker">מחשבון אומדן מחיר מהיר</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
            כמה תעלה הנסיעה?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-cream/70">
            בוחרים מוצא ויעד, מקבלים טווח מחיר וזמן משוער — וממשיכים ישר ל-WhatsApp.
          </p>
        </div>

        <div className="glass-card mt-10 grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block sm:col-span-1">
              <span className="text-sm font-bold text-cream">עיר מוצא</span>
              <input
                list="fare-origin-list"
                value={origin}
                onChange={(event) => setOrigin(event.target.value)}
                className={fieldClass}
                placeholder="לדוגמה: תל אביב"
              />
              <datalist id="fare-origin-list">
                {originSuggestions.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </label>

            <label className="block sm:col-span-1">
              <span className="text-sm font-bold text-cream">יעד</span>
              <input
                list="fare-destination-list"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                className={fieldClass}
                placeholder='לדוגמה: נתב"ג'
              />
              <datalist id="fare-destination-list">
                {destinationSuggestions.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </label>

            <p className="sm:col-span-2 text-xs leading-relaxed text-cream/55">
              * האומדן לצורך התמצאות בלבד. המחיר הסופי ייקבע לפני תחילת הנסיעה.
            </p>
          </div>

          <div className="flex flex-col justify-between gap-5">
            <div className="glass-card rounded-2xl border-gold/25 p-5">
              {estimate.error ? (
                <p className="text-sm font-semibold text-gold">{estimate.error}</p>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <Calculator className="mt-0.5 h-5 w-5 text-gold" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold text-cream/60">טווח מחיר משוער</p>
                      <p className="mt-1 text-3xl font-extrabold text-gold">{formatted.price}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
                    <Clock3 className="h-5 w-5 text-gold" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold text-cream/60">זמן נסיעה משוער</p>
                      <p className="mt-1 text-lg font-extrabold text-cream">{formatted.time}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-cream/60">
                    <Route className="h-4 w-4 text-gold" aria-hidden="true" />
                    <span>
                      מ{estimate.origin} ל{estimate.destination}
                      {estimate.approximate ? " · אומדן כללי" : ""}
                    </span>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={handleWhatsAppOrder}
              disabled={Boolean(estimate.error)}
              className="btn-whatsapp min-h-12 w-full px-6 text-base disabled:cursor-not-allowed disabled:opacity-45"
            >
              הזמן במחיר זה ב-WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

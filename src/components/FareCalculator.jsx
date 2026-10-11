import { ArrowRight, Calculator, Clock3, Route } from "lucide-react";
import { useMemo, useState } from "react";
import { getVehicleLabel } from "../data/defaultVehicles";
import { useLanguage } from "../context/LanguageContext";
import { useSiteData } from "../context/SiteDataContext";
import { useVehicleFlow } from "../context/VehicleFlowContext";
import { estimateFareFromRoutes, formatEstimate } from "../utils/fare";
import { buildFareWhatsAppMessage, openWhatsApp } from "../utils/whatsappLinks";

const fieldClass =
  "mt-2 w-full min-h-12 rounded-xl border border-white/15 bg-ink/80 px-4 py-3 text-base text-cream outline-none transition placeholder:text-cream/35 focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

export default function FareCalculator() {
  const { data, addLead } = useSiteData();
  const { fare, vehicles } = data;
  const { lang, t, dir } = useLanguage();
  const { selectedVehicleId, clearVehicle } = useVehicleFlow();
  const [origin, setOrigin] = useState(fare.originSuggestions[0] ?? "תל אביב");
  const [destination, setDestination] = useState(fare.destinationSuggestions[0] ?? 'נתב"ג');

  const selectedVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? null,
    [vehicles, selectedVehicleId],
  );

  const estimate = useMemo(
    () =>
      estimateFareFromRoutes(
        fare.routes,
        origin,
        destination,
        fare.surge,
        selectedVehicle?.multiplier ?? 1,
      ),
    [fare.routes, fare.surge, origin, destination, selectedVehicle],
  );

  const formatted = useMemo(() => formatEstimate(estimate, t), [estimate, t]);
  const vehicleLabel = selectedVehicle ? getVehicleLabel(selectedVehicle, lang) : "";

  function handleWhatsAppOrder() {
    if (estimate.errorKey || !selectedVehicle) return;
    addLead({
      source: "מחשבון מחיר",
      payload: {
        origin: estimate.origin,
        destination: estimate.destination,
        min: estimate.min,
        max: estimate.max,
        minutes: estimate.minutes,
        vehicleId: selectedVehicle.id,
        vehicleLabel,
      },
    });
    openWhatsApp(
      buildFareWhatsAppMessage(
        {
          origin: estimate.origin,
          destination: estimate.destination,
          min: estimate.min,
          max: estimate.max,
          minutes: estimate.minutes,
          vehicleLabel,
        },
        lang,
        fare.whatsappTemplate,
      ),
    );
  }

  const showVehicleWarning = !selectedVehicle;

  return (
    <section id="calculator" className="relative overflow-hidden bg-ink py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(245,197,24,0.1),transparent_45%)]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="section-kicker">{t("calc.kicker")}</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">{t("calc.title")}</h2>
          <p className="mt-4 text-lg leading-relaxed text-cream/70">{t("calc.subtitle")}</p>
        </div>

        <div className="glass-card mt-10 grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold text-cream/60">{t("calc.vehicle")}</p>
                <p className="mt-1 text-base font-extrabold text-gold">
                  {vehicleLabel || t("calc.errors.pickVehicle")}
                </p>
              </div>
              <button
                type="button"
                onClick={clearVehicle}
                className="btn-outline-gold inline-flex min-h-11 items-center justify-center gap-2 px-4 text-sm"
              >
                <ArrowRight className={`h-4 w-4 ${dir === "rtl" ? "" : "rotate-180"}`} aria-hidden="true" />
                {t("calc.backToVehicles")}
              </button>
            </div>

            <label className="block sm:col-span-1">
              <span className="text-sm font-bold text-cream">{t("calc.origin")}</span>
              <input
                list="fare-origin-list"
                value={origin}
                onChange={(event) => setOrigin(event.target.value)}
                className={fieldClass}
              />
              <datalist id="fare-origin-list">
                {fare.originSuggestions.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </label>

            <label className="block sm:col-span-1">
              <span className="text-sm font-bold text-cream">{t("calc.destination")}</span>
              <input
                list="fare-destination-list"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                className={fieldClass}
              />
              <datalist id="fare-destination-list">
                {fare.destinationSuggestions.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </label>

            <p className="sm:col-span-2 text-xs leading-relaxed text-cream/55">{t("calc.disclaimer")}</p>
          </div>

          <div className="flex flex-col justify-between gap-5">
            <div className="glass-card rounded-2xl border-gold/25 p-5">
              {estimate.errorKey ? (
                <p className="text-sm font-semibold text-gold">{t(estimate.errorKey)}</p>
              ) : showVehicleWarning ? (
                <p className="text-sm font-semibold text-gold">{t("calc.errors.pickVehicle")}</p>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <Calculator className="mt-0.5 h-5 w-5 text-gold" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold text-cream/60">{t("calc.priceRange")}</p>
                      <p className="mt-1 text-3xl font-extrabold text-gold">{formatted.price}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
                    <Clock3 className="h-5 w-5 text-gold" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold text-cream/60">{t("calc.eta")}</p>
                      <p className="mt-1 text-lg font-extrabold text-cream">{formatted.time}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-cream/60">
                    <Route className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                    <span>
                      {t("calc.route", { origin: estimate.origin, destination: estimate.destination })}
                      {estimate.approximate ? t("calc.approximate") : ""}
                      {estimate.surgeApplied ? t("calc.surge", { n: estimate.surgePercent }) : ""}
                    </span>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={handleWhatsAppOrder}
              disabled={Boolean(estimate.errorKey) || showVehicleWarning}
              className="btn-whatsapp min-h-12 w-full px-6 text-base disabled:cursor-not-allowed disabled:opacity-45"
            >
              {t("calc.whatsappCta")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

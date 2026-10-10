import { Car, Users } from "lucide-react";
import { getVehicleLabel, getVehicleSubtitle } from "../data/defaultVehicles";
import { useLanguage } from "../context/LanguageContext";
import { useSiteData } from "../context/SiteDataContext";
import { useVehicleFlow } from "../context/VehicleFlowContext";

export default function VehiclePicker({ prompt }) {
  const { data } = useSiteData();
  const { lang, t } = useLanguage();
  const { selectedVehicleId, selectVehicle } = useVehicleFlow();
  const vehicles = (data.vehicles ?? []).filter((vehicle) => vehicle.visible !== false);
  const promptText = prompt || t("select_vehicle_prompt");

  return (
    <div id="vehicles" className="mt-8">
      <p className="text-sm font-extrabold text-gold">{promptText}</p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {vehicles.map((vehicle) => {
          const active = selectedVehicleId === vehicle.id;
          const subtitle = getVehicleSubtitle(vehicle, lang);
          return (
            <button
              key={vehicle.id}
              type="button"
              onClick={() => selectVehicle(vehicle.id)}
              className={`glass-card group overflow-hidden rounded-2xl border p-3 text-start transition hover:-translate-y-0.5 ${
                active ? "border-gold/60 ring-2 ring-gold/30" : "border-white/10"
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-ink-soft">
                {vehicle.image ? (
                  <img
                    src={vehicle.image}
                    alt={getVehicleLabel(vehicle, lang)}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/5 to-gold/10">
                    <Car className="h-12 w-12 text-gold/70" aria-hidden="true" />
                  </div>
                )}
              </div>
              <p className="mt-3 text-base font-extrabold text-cream">{getVehicleLabel(vehicle, lang)}</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-cream/65">
                <Users className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                {subtitle || t("hero.passengers", { n: vehicle.capacity })}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

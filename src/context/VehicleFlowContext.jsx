import { createContext, useContext, useMemo, useState } from "react";

const VehicleFlowContext = createContext(null);

export function VehicleFlowProvider({ children }) {
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  const api = useMemo(
    () => ({
      selectedVehicleId,
      selectVehicle: (id) => {
        setSelectedVehicleId(id);
        window.setTimeout(() => {
          document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      },
      clearVehicle: () => {
        setSelectedVehicleId("");
        window.setTimeout(() => {
          document.getElementById("vehicles")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      },
    }),
    [selectedVehicleId],
  );

  return <VehicleFlowContext.Provider value={api}>{children}</VehicleFlowContext.Provider>;
}

export function useVehicleFlow() {
  const ctx = useContext(VehicleFlowContext);
  if (!ctx) throw new Error("useVehicleFlow must be used within VehicleFlowProvider");
  return ctx;
}

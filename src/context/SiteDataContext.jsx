import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createLead, loadSiteState, saveSiteState, STORAGE_KEY } from "../store/siteStorage";

const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const [data, setData] = useState(() => loadSiteState());
  const [notice, setNotice] = useState("");

  useEffect(() => {
    saveSiteState(data);
  }, [data]);

  useEffect(() => {
    function onStorage(event) {
      if (event.key === STORAGE_KEY) {
        setData(loadSiteState());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const api = useMemo(
    () => ({
      data,
      notice,
      setNotice,
      updateSite: (patch) => setData((current) => ({ ...current, site: { ...current.site, ...patch } })),
      setAvailability: (isAvailable) =>
        setData((current) => ({ ...current, availability: { isAvailable } })),
      setFare: (fare) => setData((current) => ({ ...current, fare: { ...current.fare, ...fare } })),
      setTestimonials: (testimonials) => setData((current) => ({ ...current, testimonials })),
      addLead: ({ source, payload }) =>
        setData((current) => ({
          ...current,
          leads: [createLead({ source, payload }), ...current.leads].slice(0, 200),
        })),
      updateLeadStatus: (id, status) =>
        setData((current) => ({
          ...current,
          leads: current.leads.map((lead) => (lead.id === id ? { ...lead, status } : lead)),
        })),
      saveAll: (nextData) => {
        setData(nextData);
        setNotice("השינויים נשמרו בהצלחה");
        window.setTimeout(() => setNotice(""), 2600);
      },
      reloadFromStorage: () => setData(loadSiteState()),
    }),
    [data, notice],
  );

  return <SiteDataContext.Provider value={api}>{children}</SiteDataContext.Provider>;
}

export function useSiteData() {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error("useSiteData must be used within SiteDataProvider");
  }
  return context;
}

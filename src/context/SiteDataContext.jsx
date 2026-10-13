import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { isSupabaseConfigured } from "../lib/supabase";
import {
  loadSiteData,
  mergeRemoteRides,
  mergeRemoteSettings,
  persistSiteData,
} from "../services/siteDataRepository";
import { subscribeToRides } from "../services/supabaseRidesService";
import { subscribeToSiteSettings } from "../services/supabaseSettingsService";
import { rideFromWebsiteLead } from "../store/rides";
import { createLead, loadSiteState, STORAGE_KEY } from "../store/siteStorage";

const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const [data, setData] = useState(() => loadSiteState());
  const [notice, setNotice] = useState("");
  const [storageMode, setStorageMode] = useState(() => (isSupabaseConfigured() ? "supabase" : "local"));
  const [cloudReady, setCloudReady] = useState(() => !isSupabaseConfigured());
  const skipPersistRef = useRef(true);
  const remoteSyncRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    loadSiteData().then((next) => {
      if (cancelled) return;
      skipPersistRef.current = true;
      setData(next);
      setStorageMode(isSupabaseConfigured() ? "supabase" : "local");
      setCloudReady(true);
      window.requestAnimationFrame(() => {
        skipPersistRef.current = false;
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!cloudReady || skipPersistRef.current) return undefined;

    const timeoutId = window.setTimeout(() => {
      persistSiteData(data).then((result) => {
        if (result.source === "supabase") {
          setStorageMode("supabase");
        }
      });
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [data, cloudReady]);

  useEffect(() => {
    function onStorage(event) {
      if (event.key === STORAGE_KEY && !remoteSyncRef.current) {
        setData(loadSiteState());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return undefined;

    const unsubscribeRides = subscribeToRides((rides) => {
      remoteSyncRef.current = true;
      skipPersistRef.current = true;
      setData((current) => mergeRemoteRides(current, rides));
      window.requestAnimationFrame(() => {
        skipPersistRef.current = false;
        remoteSyncRef.current = false;
      });
    });

    const unsubscribeSettings = subscribeToSiteSettings((payload) => {
      remoteSyncRef.current = true;
      skipPersistRef.current = true;
      setData((current) => mergeRemoteSettings(current, payload));
      window.requestAnimationFrame(() => {
        skipPersistRef.current = false;
        remoteSyncRef.current = false;
      });
    });

    return () => {
      unsubscribeRides();
      unsubscribeSettings();
    };
  }, []);

  const api = useMemo(
    () => ({
      data,
      notice,
      storageMode,
      cloudReady,
      setNotice,
      updateSite: (patch) => setData((current) => ({ ...current, site: { ...current.site, ...patch } })),
      setFare: (fare) => setData((current) => ({ ...current, fare: { ...current.fare, ...fare } })),
      setTestimonials: (testimonials) => setData((current) => ({ ...current, testimonials })),
      addLead: ({ source, payload }) =>
        setData((current) => {
          const lead = createLead({ source, payload });
          const ride = rideFromWebsiteLead(lead, current.rides ?? []);
          return {
            ...current,
            leads: [lead, ...current.leads].slice(0, 200),
            rides: [ride, ...(current.rides ?? [])].slice(0, 500),
          };
        }),
      updateLeadStatus: (id, status) => {
        setData((current) => ({
          ...current,
          leads: current.leads.map((lead) => (lead.id === id ? { ...lead, status } : lead)),
        }));
        setNotice("סטטוס הפנייה עודכן");
        window.setTimeout(() => setNotice(""), 2600);
      },
      saveAll: (nextData) => {
        setData(nextData);
        setNotice("השינויים נשמרו בהצלחה");
        window.setTimeout(() => setNotice(""), 2600);
        persistSiteData(nextData);
      },
      recordClick: (kind) => {
        setData((current) => ({
          ...current,
          analytics: {
            callClicks: (current.analytics?.callClicks ?? 0) + (kind === "call" ? 1 : 0),
            whatsappClicks: (current.analytics?.whatsappClicks ?? 0) + (kind === "whatsapp" ? 1 : 0),
          },
        }));
      },
      reloadFromStorage: () => {
        loadSiteData().then((next) => setData(next));
      },
    }),
    [data, notice, storageMode, cloudReady],
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

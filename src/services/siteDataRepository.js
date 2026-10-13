import { isSupabaseConfigured } from "../lib/supabase";
import { createDefaultSiteState } from "../store/defaults";
import { normalizeRides } from "../store/rides";
import { loadSiteState, mergeStoredSitePayload, saveSiteState } from "../store/siteStorage";
import { fetchRidesFromSupabase, syncRidesToSupabase } from "./supabaseRidesService";
import { loadSiteSettingsFromSupabase, saveSiteSettingsToSupabase } from "./supabaseSettingsService";

export function getStorageMode() {
  return isSupabaseConfigured() ? "supabase" : "local";
}

/** Load site data — Supabase when configured, otherwise localStorage. */
export async function loadSiteData() {
  const defaults = createDefaultSiteState();

  if (!isSupabaseConfigured()) {
    return loadSiteState();
  }

  try {
    const [settingsBase, rides] = await Promise.all([
      loadSiteSettingsFromSupabase(defaults),
      fetchRidesFromSupabase(),
    ]);

    const mergedSettings = settingsBase ?? loadSiteState();
    return {
      ...mergedSettings,
      rides: rides ?? mergedSettings.rides ?? [],
      static: defaults.static,
    };
  } catch (error) {
    console.warn("[siteData] Supabase load failed — using localStorage", error);
    return loadSiteState();
  }
}

/** Persist site data — always mirrors to localStorage; syncs cloud when configured. */
export async function persistSiteData(state) {
  saveSiteState(state);

  if (!isSupabaseConfigured()) {
    return { ok: true, source: "local" };
  }

  try {
    await Promise.all([
      saveSiteSettingsToSupabase(state),
      syncRidesToSupabase(state.rides ?? []),
    ]);
    return { ok: true, source: "supabase" };
  } catch (error) {
    console.warn("[siteData] Supabase save failed — kept localStorage copy", error);
    return { ok: false, source: "local", error };
  }
}

/** Merge remote settings payload into current state (realtime). */
export function mergeRemoteSettings(current, remotePayload) {
  const defaults = createDefaultSiteState();
  const merged = mergeStoredSitePayload(defaults, remotePayload);
  return {
    ...current,
    ...merged,
    rides: current.rides ?? [],
    static: defaults.static,
  };
}

/** Apply remote ride list (realtime). */
export function mergeRemoteRides(current, rides) {
  return {
    ...current,
    rides: normalizeRides(rides ?? []),
  };
}

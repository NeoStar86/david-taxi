import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { mergeStoredSitePayload } from "../store/siteStorage";

export const SETTINGS_TABLE = "settings";
export const SITE_SETTINGS_ROW_ID = "site";

function stripRidesFromState(state) {
  const { rides: _rides, static: _static, ...rest } = state;
  return rest;
}

export async function loadSiteSettingsFromSupabase(defaults) {
  if (!isSupabaseConfigured() || !supabase) return null;

  const { data, error } = await supabase
    .from(SETTINGS_TABLE)
    .select("payload")
    .eq("id", SITE_SETTINGS_ROW_ID)
    .maybeSingle();

  if (error) throw error;
  if (!data?.payload) return null;

  return mergeStoredSitePayload(defaults, data.payload);
}

export async function saveSiteSettingsToSupabase(state) {
  if (!isSupabaseConfigured() || !supabase) return { ok: false, reason: "offline" };

  const payload = stripRidesFromState(state);
  const { error } = await supabase.from(SETTINGS_TABLE).upsert(
    {
      id: SITE_SETTINGS_ROW_ID,
      payload,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) throw error;
  return { ok: true };
}

export function subscribeToSiteSettings(onChange) {
  if (!isSupabaseConfigured() || !supabase) {
    return () => {};
  }

  const channel = supabase
    .channel("settings-realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: SETTINGS_TABLE,
        filter: `id=eq.${SITE_SETTINGS_ROW_ID}`,
      },
      (payload) => {
        const nextPayload = payload.new?.payload;
        if (nextPayload) onChange(nextPayload);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

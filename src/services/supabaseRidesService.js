import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { normalizeRides } from "../store/rides";

export const RIDES_TABLE = "rides";

function rowToRide(row) {
  if (!row) return null;
  if (row.payload && typeof row.payload === "object") {
    return { ...row.payload, id: row.payload.id ?? row.id };
  }
  return { id: row.id, ...row };
}

function rideToRow(ride) {
  return {
    id: ride.id,
    payload: ride,
    updated_at: new Date().toISOString(),
  };
}

export async function fetchRidesFromSupabase() {
  if (!isSupabaseConfigured() || !supabase) return null;

  const { data, error } = await supabase
    .from(RIDES_TABLE)
    .select("id, payload, updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return normalizeRides((data ?? []).map(rowToRide).filter(Boolean));
}

export async function insertRideInSupabase(ride) {
  if (!isSupabaseConfigured() || !supabase) return { ok: false, reason: "offline" };

  const { error } = await supabase.from(RIDES_TABLE).insert(rideToRow(ride));
  if (error) throw error;
  return { ok: true };
}

export async function updateRideInSupabase(ride) {
  if (!isSupabaseConfigured() || !supabase) return { ok: false, reason: "offline" };

  const { error } = await supabase.from(RIDES_TABLE).upsert(rideToRow(ride), { onConflict: "id" });
  if (error) throw error;
  return { ok: true };
}

export async function deleteRideFromSupabase(rideId) {
  if (!isSupabaseConfigured() || !supabase) return { ok: false, reason: "offline" };

  const { error } = await supabase.from(RIDES_TABLE).delete().eq("id", rideId);
  if (error) throw error;
  return { ok: true };
}

/** Replace cloud ride list with the current in-app list (admin save / sync). */
export async function syncRidesToSupabase(rides = []) {
  if (!isSupabaseConfigured() || !supabase) return { ok: false, reason: "offline" };

  const rows = rides.map(rideToRow);
  const keepIds = new Set(rides.map((ride) => ride.id));

  if (rows.length > 0) {
    const { error: upsertError } = await supabase.from(RIDES_TABLE).upsert(rows, { onConflict: "id" });
    if (upsertError) throw upsertError;
  }

  const { data: existing, error: listError } = await supabase.from(RIDES_TABLE).select("id");
  if (listError) throw listError;

  const orphanIds = (existing ?? []).map((row) => row.id).filter((id) => !keepIds.has(id));
  if (orphanIds.length > 0) {
    const { error: deleteError } = await supabase.from(RIDES_TABLE).delete().in("id", orphanIds);
    if (deleteError) throw deleteError;
  }

  return { ok: true };
}

export function subscribeToRides(onChange) {
  if (!isSupabaseConfigured() || !supabase) {
    return () => {};
  }

  const channel = supabase
    .channel("rides-realtime")
    .on("postgres_changes", { event: "*", schema: "public", table: RIDES_TABLE }, () => {
      fetchRidesFromSupabase()
        .then((rides) => {
          if (rides) onChange(rides);
        })
        .catch((error) => {
          console.warn("[supabase] rides realtime refresh failed", error);
        });
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

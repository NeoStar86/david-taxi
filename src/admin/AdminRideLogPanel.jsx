import { useMemo, useState } from "react";
import { useSiteData } from "../context/SiteDataContext";
import { DEFAULT_COMMISSION_PERCENT, RIDE_STATUSES, parsePriceNumber, isRideInMonth } from "../store/rides";
import { downloadRidesCsv } from "../utils/exportRidesCsv";
import { shareRideToDriverGroup } from "../utils/driverGroupShare";

const inputClass =
  "mt-2 w-full min-h-12 rounded-xl border border-white/15 bg-ink/80 px-4 py-3 text-base outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

const emptyForm = {
  clientName: "",
  phone: "",
  origin: "",
  destination: "",
  dateTime: "",
  vehicleType: "",
  agreedPrice: "",
  status: "מתוכננת",
  commissionPercent: DEFAULT_COMMISSION_PERCENT,
};

export default function AdminRideLogPanel({ draft, setDraft, persist }) {
  const { data } = useSiteData();
  const rides = draft.rides ?? [];
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const monthStats = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const inMonth = rides.filter((ride) => isRideInMonth(ride, year, month));
    const completed = inMonth.filter((ride) => ride.status === "בוצעה");
    const revenue = completed.reduce((sum, ride) => sum + parsePriceNumber(ride.agreedPrice), 0);
    return { completed: completed.length, revenue, totalInMonth: inMonth.length };
  }, [rides]);

  function updateRide(id, patch) {
    setDraft((current) => ({
      ...current,
      rides: (current.rides ?? []).map((ride) => (ride.id === id ? { ...ride, ...patch } : ride)),
    }));
  }

  function deleteRide(id) {
    setDraft((current) => ({
      ...current,
      rides: (current.rides ?? []).filter((ride) => ride.id !== id),
    }));
  }

  function handleAddRide(event) {
    event.preventDefault();
    const newRide = {
      id: `ride-${Date.now()}`,
      createdAt: new Date().toISOString(),
      source: "manual",
      ...form,
      agreedPrice: String(form.agreedPrice),
      commissionPercent: Number(form.commissionPercent) || DEFAULT_COMMISSION_PERCENT,
    };
    const nextDraft = {
      ...draft,
      rides: [newRide, ...(draft.rides ?? [])],
    };
    setDraft(nextDraft);
    persist(nextDraft);
    setForm(emptyForm);
    setShowModal(false);
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold">יומן נסיעות ומכירת נסיעות</h2>
          <p className="mt-1 text-sm text-cream/60">מעקב אחר פניות מהאתר ונסיעות ידניות — נשמר ב-localStorage.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary min-h-11 px-4 text-sm" onClick={() => setShowModal(true)}>
            + הוספת נסיעה
          </button>
          <button
            type="button"
            className="btn-secondary min-h-11 px-4 text-sm"
            onClick={() => downloadRidesCsv(rides)}
          >
            ייצוא CSV
          </button>
          <button type="button" className="btn-outline-gold min-h-11 px-4 text-sm" onClick={() => persist(draft)}>
            שמור יומן
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-ink/40 p-4 text-center">
          <p className="text-2xl font-extrabold text-gold">{monthStats.completed}</p>
          <p className="text-xs text-cream/60">נסיעות שבוצעו החודש</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink/40 p-4 text-center">
          <p className="text-2xl font-extrabold text-gold">{Math.round(monthStats.revenue).toLocaleString("he-IL")} ₪</p>
          <p className="text-xs text-cream/60">הכנסות (נסיעות שבוצעו)</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink/40 p-4 text-center">
          <p className="text-2xl font-extrabold text-gold">{monthStats.totalInMonth}</p>
          <p className="text-xs text-cream/60">סה״כ רשומות החודש</p>
        </div>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-cream/70">
              <th className="px-2 py-2 text-start">לקוח</th>
              <th className="px-2 py-2 text-start">מסלול</th>
              <th className="px-2 py-2 text-start">מועד</th>
              <th className="px-2 py-2 text-start">רכב</th>
              <th className="px-2 py-2 text-start">מחיר</th>
              <th className="px-2 py-2 text-start">סטטוס</th>
              <th className="px-2 py-2 text-start">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {rides.map((ride) => (
              <tr key={ride.id} className="border-b border-white/5 align-top">
                <td className="px-2 py-3">
                  <p className="font-bold">{ride.clientName || "—"}</p>
                  <p className="text-xs text-cream/60">{ride.phone}</p>
                  <p className="text-[10px] text-cream/45">{ride.source === "website" ? "מהאתר" : "ידני"}</p>
                </td>
                <td className="px-2 py-3">
                  {ride.origin} → {ride.destination}
                </td>
                <td className="px-2 py-3">{ride.dateTime ? ride.dateTime.replace("T", " ") : "—"}</td>
                <td className="px-2 py-3">{ride.vehicleType || "—"}</td>
                <td className="px-2 py-3">{ride.agreedPrice ? `${ride.agreedPrice} ₪` : "—"}</td>
                <td className="px-2 py-3">
                  <select
                    className="min-h-10 rounded-lg border border-white/15 bg-ink/70 px-2"
                    value={ride.status}
                    onChange={(event) => updateRide(ride.id, { status: event.target.value })}
                  >
                    {RIDE_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-3">
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      className="btn-outline-gold min-h-10 px-3 text-xs"
                      onClick={() => shareRideToDriverGroup(ride, data.site)}
                    >
                      שתף לקבוצת נהגים 📲
                    </button>
                    <button
                      type="button"
                      className="text-xs font-bold text-gold"
                      onClick={() => deleteRide(ride.id)}
                    >
                      מחק
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {rides.map((ride) => (
          <article key={ride.id} className="rounded-2xl border border-white/10 bg-ink/40 p-4">
            <p className="font-extrabold">{ride.clientName || "—"}</p>
            <p className="text-sm text-cream/70">{ride.phone}</p>
            <p className="mt-2 text-sm">
              {ride.origin} → {ride.destination}
            </p>
            <p className="text-xs text-cream/60">{ride.dateTime?.replace("T", " ") || "—"}</p>
            <p className="text-sm">
              {ride.vehicleType} · {ride.agreedPrice ? `${ride.agreedPrice} ₪` : "—"}
            </p>
            <select
              className={`${inputClass} mt-2 min-h-10`}
              value={ride.status}
              onChange={(event) => updateRide(ride.id, { status: event.target.value })}
            >
              {RIDE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn-outline-gold mt-3 min-h-11 w-full px-3 text-sm"
              onClick={() => shareRideToDriverGroup(ride, data.site)}
            >
              שתף לקבוצת נהגים 📲
            </button>
          </article>
        ))}
      </div>

      {rides.length === 0 && (
        <p className="rounded-xl border border-dashed border-white/15 p-6 text-center text-sm text-cream/60">
          אין נסיעות עדיין. פניות חדשות מהאתר יופיעו כאן אוטומטית.
        </p>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
          <form
            onSubmit={handleAddRide}
            className="glass-card max-h-[90vh] w-full max-w-lg overflow-y-auto p-5 sm:p-6"
          >
            <h3 className="text-lg font-extrabold">הוספת נסיעה ידנית</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["clientName", "שם לקוח"],
                ["phone", "טלפון"],
                ["origin", "מוצא"],
                ["destination", "יעד"],
                ["vehicleType", "סוג רכב"],
                ["agreedPrice", "מחיר מוסכם (₪)"],
              ].map(([key, label]) => (
                <label key={key} className="block sm:col-span-1">
                  <span className="text-xs font-bold">{label}</span>
                  <input
                    className={inputClass}
                    value={form[key]}
                    onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                    required={key === "clientName" || key === "origin" || key === "destination"}
                  />
                </label>
              ))}
              <label className="block sm:col-span-2">
                <span className="text-xs font-bold">תאריך ושעה</span>
                <input
                  type="datetime-local"
                  dir="ltr"
                  className={`${inputClass} text-start`}
                  value={form.dateTime}
                  onChange={(event) => setForm((current) => ({ ...current, dateTime: event.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold">סטטוס</span>
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
                >
                  {RIDE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-bold">עמלה לנהג (%)</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className={inputClass}
                  value={form.commissionPercent}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, commissionPercent: event.target.value }))
                  }
                />
              </label>
            </div>
            <div className="mt-5 flex gap-2">
              <button type="submit" className="btn-primary min-h-11 flex-1 px-4">
                שמור נסיעה
              </button>
              <button type="button" className="btn-secondary min-h-11 px-4" onClick={() => setShowModal(false)}>
                ביטול
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

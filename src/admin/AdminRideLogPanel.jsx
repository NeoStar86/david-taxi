import { useMemo, useState } from "react";
import {
  COMMISSION_TYPES,
  DEFAULT_COMMISSION_PERCENT,
  PAYMENT_METHODS,
  RIDE_STATUSES,
  computeNetProfit,
  createRide,
  filterRides,
  isRideInMonth,
  parsePriceNumber,
} from "../store/rides";
import { downloadRidesCsv } from "../utils/exportRidesCsv";
import { shareRideToDriverGroup } from "../utils/driverGroupShare";

const inputClass =
  "mt-2 w-full min-h-12 rounded-xl border border-white/15 bg-ink/80 px-4 py-3 text-base outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

const emptyForm = {
  clientName: "",
  phone: "",
  cityRegion: "",
  origin: "",
  pickup: "",
  destination: "",
  dateTime: "",
  vehicleType: "",
  basePrice: "",
  paymentMethod: "מזומן",
  commissionType: "percent",
  commissionPercent: DEFAULT_COMMISSION_PERCENT,
  commissionFixed: "",
  assignedDriverName: "",
  passengersCount: "",
  luggageDetails: "",
  flightNumber: "",
  status: "מתוכננת",
};

function RideFormFields({ form, setForm, idPrefix = "" }) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <p className="sm:col-span-2 text-xs font-bold text-gold/90">פרטי לקוח ונסיעה (לשיתוף לקבוצה)</p>
      {[
        ["clientName", "שם לקוח"],
        ["phone", "טלפון"],
        ["cityRegion", "עיר / אזור"],
        ["origin", "מוצא (עיר)"],
        ["pickup", "כתובת איסוף מפורטת"],
        ["destination", "יעד"],
        ["vehicleType", "סוג רכב"],
        ["passengersCount", "מספר נוסעים"],
        ["luggageDetails", "מטען"],
        ["flightNumber", "מספר טיסה (אופציונלי)"],
      ].map(([key, label]) => (
        <label key={key} className="block sm:col-span-1">
          <span className="text-xs font-bold">{label}</span>
          <input
            className={inputClass}
            id={idPrefix ? `${idPrefix}-${key}` : undefined}
            value={form[key]}
            onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
            required={key === "clientName" || key === "destination"}
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
        <span className="text-xs font-bold">מחיר ללקוח (₪) — לשיתוף</span>
        <input
          className={inputClass}
          value={form.basePrice}
          onChange={(event) => setForm((current) => ({ ...current, basePrice: event.target.value }))}
          required
        />
      </label>
      <label className="block">
        <span className="text-xs font-bold">אמצעי תשלום</span>
        <select
          className={inputClass}
          value={form.paymentMethod}
          onChange={(event) => setForm((current) => ({ ...current, paymentMethod: event.target.value }))}
        >
          {PAYMENT_METHODS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
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

      <p className="sm:col-span-2 mt-2 text-xs font-bold text-cream/50">פנימי — לא נשלח לקבוצת נהגים</p>
      <label className="block">
        <span className="text-xs font-bold">שם נהג משובץ</span>
        <input
          className={inputClass}
          value={form.assignedDriverName}
          onChange={(event) => setForm((current) => ({ ...current, assignedDriverName: event.target.value }))}
        />
      </label>
      <label className="block">
        <span className="text-xs font-bold">סוג עמלה</span>
        <select
          className={inputClass}
          value={form.commissionType}
          onChange={(event) => setForm((current) => ({ ...current, commissionType: event.target.value }))}
        >
          {COMMISSION_TYPES.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>
      </label>
      {form.commissionType === "percent" ? (
        <label className="block">
          <span className="text-xs font-bold">עמלה (%)</span>
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
      ) : (
        <label className="block">
          <span className="text-xs font-bold">עמלה (₪)</span>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={form.commissionFixed}
            onChange={(event) => setForm((current) => ({ ...current, commissionFixed: event.target.value }))}
          />
        </label>
      )}
    </div>
  );
}

function InternalProfitBadge({ ride }) {
  const net = Math.round(computeNetProfit(ride));
  return (
    <span className="inline-block rounded-lg bg-gold/15 px-2 py-0.5 text-xs font-bold text-gold">
      רווח נטו: {net.toLocaleString("he-IL")} ₪
    </span>
  );
}

export default function AdminRideLogPanel({ draft, setDraft, persist }) {
  const rides = draft.rides ?? [];
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredRides = useMemo(() => filterRides(rides, searchQuery), [rides, searchQuery]);

  const monthStats = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const inMonth = rides.filter((ride) => isRideInMonth(ride, year, month));
    const completed = inMonth.filter((ride) => ride.status === "בוצעה");
    const revenue = completed.reduce(
      (sum, ride) => sum + parsePriceNumber(ride.basePrice || ride.agreedPrice),
      0,
    );
    const netProfit = completed.reduce((sum, ride) => sum + computeNetProfit(ride), 0);
    return { completed: completed.length, revenue, netProfit, totalInMonth: inMonth.length };
  }, [rides]);

  function updateRide(id, patch) {
    setDraft((current) => ({
      ...current,
      rides: (current.rides ?? []).map((ride) => {
        if (ride.id !== id) return ride;
        const next = { ...ride, ...patch };
        if (patch.basePrice != null) {
          next.agreedPrice = String(patch.basePrice);
        }
        if (patch.pickup == null && patch.origin) {
          next.pickup = patch.origin;
        }
        return next;
      }),
    }));
  }

  function deleteRide(id) {
    setDraft((current) => ({
      ...current,
      rides: (current.rides ?? []).filter((ride) => ride.id !== id),
    }));
  }

  function openEdit(ride) {
    setEditId(ride.id);
    setForm({
      ...emptyForm,
      ...ride,
      basePrice: ride.basePrice || ride.agreedPrice || "",
      commissionPercent: ride.commissionPercent ?? DEFAULT_COMMISSION_PERCENT,
      commissionFixed: ride.commissionFixed ?? "",
    });
  }

  function closeModals() {
    setShowModal(false);
    setEditId(null);
    setForm(emptyForm);
  }

  function handleAddRide(event) {
    event.preventDefault();
    const newRide = createRide(
      {
        source: "manual",
        ...form,
        basePrice: String(form.basePrice),
        commissionPercent: Number(form.commissionPercent) || DEFAULT_COMMISSION_PERCENT,
        commissionFixed: form.commissionFixed ? String(form.commissionFixed) : "",
        pickup: form.pickup || form.origin,
      },
      draft.rides ?? [],
    );
    const nextDraft = {
      ...draft,
      rides: [newRide, ...(draft.rides ?? [])],
    };
    setDraft(nextDraft);
    persist(nextDraft);
    closeModals();
  }

  function handleSaveEdit(event) {
    event.preventDefault();
    const patch = {
      ...form,
      basePrice: String(form.basePrice),
      agreedPrice: String(form.basePrice),
      commissionPercent: Number(form.commissionPercent) || DEFAULT_COMMISSION_PERCENT,
      commissionFixed: form.commissionFixed ? String(form.commissionFixed) : "",
      pickup: form.pickup || form.origin,
    };
    const nextDraft = {
      ...draft,
      rides: (draft.rides ?? []).map((ride) => (ride.id === editId ? { ...ride, ...patch } : ride)),
    };
    setDraft(nextDraft);
    persist(nextDraft);
    closeModals();
  }

  function renderRideActions(ride) {
    return (
      <div className="flex flex-col gap-2">
        <button type="button" className="text-xs font-bold text-cream/80" onClick={() => openEdit(ride)}>
          עריכה / פנימי
        </button>
        <button
          type="button"
          className="btn-outline-gold min-h-10 px-3 text-xs"
          onClick={() => shareRideToDriverGroup(ride)}
        >
          שתף לקבוצה 📲
        </button>
        <button type="button" className="text-xs font-bold text-gold" onClick={() => deleteRide(ride.id)}>
          מחק
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold">יומן נסיעות ומכירת נסיעות</h2>
          <p className="mt-1 text-sm text-cream/60">
            מזהה הזמנה אוטומטי, חיפוש מהיר, ושיתוף לקבוצה ללא נתונים פנימיים.
          </p>
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

      <label className="block">
        <span className="text-xs font-bold text-cream/70">חיפוש — מזהה הזמנה, נהג, לקוח, טלפון, עיר, מוצא או יעד</span>
        <input
          type="search"
          className={`${inputClass} mt-1`}
          placeholder="לדוגמה: #2507, יוסי, תל אביב, 050…"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-ink/40 p-4 text-center">
          <p className="text-2xl font-extrabold text-gold">{monthStats.completed}</p>
          <p className="text-xs text-cream/60">נסיעות שבוצעו החודש</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink/40 p-4 text-center">
          <p className="text-2xl font-extrabold text-gold">
            {Math.round(monthStats.revenue).toLocaleString("he-IL")} ₪
          </p>
          <p className="text-xs text-cream/60">מחזור (נסיעות שבוצעו)</p>
        </div>
        <div className="rounded-2xl border border-gold/25 bg-gold/5 p-4 text-center">
          <p className="text-2xl font-extrabold text-gold">
            {Math.round(monthStats.netProfit).toLocaleString("he-IL")} ₪
          </p>
          <p className="text-xs text-cream/60">רווח נטו (פנימי)</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink/40 p-4 text-center">
          <p className="text-2xl font-extrabold text-gold">{monthStats.totalInMonth}</p>
          <p className="text-xs text-cream/60">סה״כ רשומות החודש</p>
        </div>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-cream/70">
              <th className="px-2 py-2 text-start">הזמנה</th>
              <th className="px-2 py-2 text-start">לקוח</th>
              <th className="px-2 py-2 text-start">מסלול</th>
              <th className="px-2 py-2 text-start">מועד</th>
              <th className="px-2 py-2 text-start">נהג / פנימי</th>
              <th className="px-2 py-2 text-start">מחיר</th>
              <th className="px-2 py-2 text-start">סטטוס</th>
              <th className="px-2 py-2 text-start">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filteredRides.map((ride) => (
              <tr key={ride.id} className="border-b border-white/5 align-top">
                <td className="px-2 py-3 font-mono font-bold text-gold">{ride.orderId || "—"}</td>
                <td className="px-2 py-3">
                  <p className="font-bold">{ride.clientName || "—"}</p>
                  <p className="text-xs text-cream/60">{ride.phone}</p>
                  <p className="text-[10px] text-cream/45">{ride.source === "website" ? "מהאתר" : "ידני"}</p>
                  {ride.flightNumber ? (
                    <p className="mt-1 text-[10px] text-cream/55">✈️ {ride.flightNumber}</p>
                  ) : null}
                </td>
                <td className="px-2 py-3">
                  <p className="text-xs text-cream/55">{ride.cityRegion || "—"}</p>
                  <p>
                    {ride.pickup || ride.origin} → {ride.destination}
                  </p>
                </td>
                <td className="px-2 py-3">{ride.dateTime ? ride.dateTime.replace("T", " ") : "—"}</td>
                <td className="px-2 py-3">
                  <p className="text-xs">{ride.assignedDriverName || "—"}</p>
                  <InternalProfitBadge ride={ride} />
                  <p className="mt-1 text-[10px] text-cream/45">{ride.paymentMethod || "מזומן"}</p>
                </td>
                <td className="px-2 py-3">
                  {ride.basePrice || ride.agreedPrice ? `${ride.basePrice || ride.agreedPrice} ₪` : "—"}
                </td>
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
                <td className="px-2 py-3">{renderRideActions(ride)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 lg:hidden">
        {filteredRides.map((ride) => (
          <article key={ride.id} className="rounded-2xl border border-white/10 bg-ink/40 p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="font-mono text-lg font-extrabold text-gold">{ride.orderId}</p>
              <InternalProfitBadge ride={ride} />
            </div>
            <p className="font-extrabold">{ride.clientName || "—"}</p>
            <p className="text-sm text-cream/70">{ride.phone}</p>
            {ride.flightNumber ? <p className="text-xs text-cream/60">✈️ {ride.flightNumber}</p> : null}
            <p className="mt-2 text-sm text-cream/55">{ride.cityRegion}</p>
            <p className="text-sm">
              {ride.pickup || ride.origin} → {ride.destination}
            </p>
            <p className="text-xs text-cream/60">{ride.dateTime?.replace("T", " ") || "—"}</p>
            <p className="text-sm">
              {ride.vehicleType} · {ride.basePrice || ride.agreedPrice ? `${ride.basePrice || ride.agreedPrice} ₪` : "—"}
            </p>
            <p className="text-xs text-cream/55">נהג: {ride.assignedDriverName || "—"} · {ride.paymentMethod}</p>
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
            <div className="mt-3 flex flex-wrap gap-2">{renderRideActions(ride)}</div>
          </article>
        ))}
      </div>

      {filteredRides.length === 0 && (
        <p className="rounded-xl border border-dashed border-white/15 p-6 text-center text-sm text-cream/60">
          {rides.length === 0
            ? "אין נסיעות עדיין. פניות חדשות מהאתר יופיעו כאן אוטומטית."
            : "לא נמצאו נסיעות התואמות לחיפוש."}
        </p>
      )}

      {(showModal || editId) && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
          <form
            onSubmit={editId ? handleSaveEdit : handleAddRide}
            className="glass-card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-5 sm:p-6"
          >
            <h3 className="text-lg font-extrabold">{editId ? "עריכת נסיעה" : "הוספת נסיעה ידנית"}</h3>
            {editId ? (
              <p className="mt-1 font-mono text-sm text-gold">
                {draft.rides?.find((r) => r.id === editId)?.orderId}
              </p>
            ) : null}
            <RideFormFields form={form} setForm={setForm} />
            <div className="mt-5 flex gap-2">
              <button type="submit" className="btn-primary min-h-11 flex-1 px-4">
                {editId ? "שמור שינויים" : "שמור נסיעה"}
              </button>
              <button type="button" className="btn-secondary min-h-11 px-4" onClick={closeModals}>
                ביטול
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

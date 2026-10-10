import { useMemo, useRef, useState } from "react";
import {
  COMMISSION_TYPES,
  DEFAULT_COMMISSION_PERCENT,
  PAYMENT_METHODS,
  RIDE_STATUSES,
  RIDE_STATUS_SOLD_TO_DRIVER,
  computeMonthlyRevenueMetrics,
  computeNetProfit,
  computePendingCommissions,
  computeTodaySummary,
  createRide,
  filterRides,
  isCommissionPending,
} from "../store/rides";
import { downloadRidesCsv } from "../utils/exportRidesCsv";
import {
  SHARE_TEMPLATES,
  openDriverGroupShare,
} from "../utils/driverGroupShare";

const inputClass =
  "mt-2 w-full min-h-12 rounded-xl border border-white/15 bg-ink/80 px-4 py-3 text-base outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

const SEARCH_SHORTCUTS = [
  { label: "# מזהה", prefix: "#" },
  { label: "נהג", prefix: "" },
  { label: "עיר", prefix: "" },
];

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
  const [shareRide, setShareRide] = useState(null);
  const [shareTemplate, setShareTemplate] = useState(SHARE_TEMPLATES[0].id);
  const [showTodayModal, setShowTodayModal] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchInputRef = useRef(null);
  const desktopSearchRef = useRef(null);

  const filteredRides = useMemo(() => filterRides(rides, searchQuery), [rides, searchQuery]);

  const monthMetrics = useMemo(() => computeMonthlyRevenueMetrics(rides), [rides]);
  const pendingCommissions = useMemo(() => computePendingCommissions(rides), [rides]);
  const todaySummary = useMemo(() => computeTodaySummary(rides), [rides]);

  function applyDraft(nextDraft) {
    setDraft(nextDraft);
    persist(nextDraft);
  }

  function patchRideStatus(id, status) {
    const patch = { status };
    if (status === RIDE_STATUS_SOLD_TO_DRIVER) {
      patch.commissionPaid = false;
      patch.commissionPaidAt = "";
    }
    applyDraft({
      ...draft,
      rides: (draft.rides ?? []).map((ride) => (ride.id === id ? { ...ride, ...patch } : ride)),
    });
  }

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
        if (patch.status === RIDE_STATUS_SOLD_TO_DRIVER) {
          next.commissionPaid = false;
          next.commissionPaidAt = "";
        }
        return next;
      }),
    }));
  }

  function markCommissionPaid(rideId) {
    const nextDraft = {
      ...draft,
      rides: (draft.rides ?? []).map((ride) =>
        ride.id === rideId
          ? {
              ...ride,
              commissionPaid: true,
              commissionPaidAt: new Date().toISOString(),
            }
          : ride,
      ),
    };
    applyDraft(nextDraft);
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

  function focusSearch() {
    setShowMobileSearch(true);
    window.setTimeout(() => searchInputRef.current?.focus(), 80);
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
    applyDraft({
      ...draft,
      rides: [newRide, ...(draft.rides ?? [])],
    });
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
    if (patch.status === RIDE_STATUS_SOLD_TO_DRIVER && !form.commissionPaid) {
      patch.commissionPaid = false;
      patch.commissionPaidAt = "";
    }
    applyDraft({
      ...draft,
      rides: (draft.rides ?? []).map((ride) => (ride.id === editId ? { ...ride, ...patch } : ride)),
    });
    closeModals();
  }

  function openShareModal(ride) {
    setShareRide(ride);
    setShareTemplate(SHARE_TEMPLATES[0].id);
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
          onClick={() => openShareModal(ride)}
        >
          שתף לקבוצה 📲
        </button>
        {isCommissionPending(ride) ? (
          <button
            type="button"
            className="min-h-10 rounded-lg bg-emerald-600/90 px-3 text-xs font-bold text-white"
            onClick={() => markCommissionPaid(ride.id)}
          >
            סומן כשולם
          </button>
        ) : null}
        <button type="button" className="text-xs font-bold text-gold" onClick={() => deleteRide(ride.id)}>
          מחק
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-6 pb-28 md:pb-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold">יומן נסיעות ומכירת נסיעות</h2>
          <p className="mt-1 text-sm text-cream/60">
            עמלות פתוחות, תבניות שיתוף, וסיכומי הכנסות — מותאם למובייל.
          </p>
        </div>
        <div className="hidden flex-wrap gap-2 sm:flex">
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
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-ink/60 to-ink/30 p-4">
          <p className="text-xs font-bold text-cream/55">מחזור ברוטו — החודש</p>
          <p className="mt-1 text-2xl font-extrabold text-gold">
            {Math.round(monthMetrics.grossRevenue).toLocaleString("he-IL")} ₪
          </p>
        </div>
        <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4">
          <p className="text-xs font-bold text-cream/55">עמלות נטו שנגבו — החודש</p>
          <p className="mt-1 text-2xl font-extrabold text-gold">
            {Math.round(monthMetrics.netCommissionEarned).toLocaleString("he-IL")} ₪
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink/40 p-4">
          <p className="text-xs font-bold text-cream/55">נסיעות שהושלמו — החודש</p>
          <p className="mt-1 text-2xl font-extrabold text-gold">{monthMetrics.completedCount}</p>
        </div>
      </div>

      <article className="rounded-2xl border border-amber-500/35 bg-amber-500/10 p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-extrabold">עמלות פתוחות לגבייה</h3>
            <p className="text-sm text-cream/65">
              נסיעות בסטטוס &quot;{RIDE_STATUS_SOLD_TO_DRIVER}&quot; שטרם סומנו כשולמו
            </p>
          </div>
          <p className="text-xl font-extrabold text-amber-200">
            {Math.round(pendingCommissions.grandTotal).toLocaleString("he-IL")} ₪
            <span className="ms-2 text-sm font-normal text-cream/60">({pendingCommissions.count} נסיעות)</span>
          </p>
        </div>
        {pendingCommissions.drivers.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {pendingCommissions.drivers.map((row) => (
              <li key={row.driverName} className="rounded-xl border border-white/10 bg-ink/50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold">{row.driverName}</p>
                  <p className="font-extrabold text-gold">{Math.round(row.total).toLocaleString("he-IL")} ₪</p>
                </div>
                <ul className="mt-2 space-y-2">
                  {row.rides.map((item) => (
                    <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span>
                        {item.orderId} · {item.clientName || "—"} —{" "}
                        {Math.round(item.amount).toLocaleString("he-IL")} ₪
                      </span>
                      <button
                        type="button"
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white"
                        onClick={() => markCommissionPaid(item.id)}
                      >
                        סומן כשולם
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-cream/55">אין עמלות פתוחות כרגע.</p>
        )}
      </article>

      <div className="hidden md:block">
        <label className="block">
          <span className="text-xs font-bold text-cream/70">
            חיפוש — מזהה הזמנה (#), נהג, לקוח, טלפון, עיר, מוצא או יעד
          </span>
          <input
            ref={desktopSearchRef}
            type="search"
            className={`${inputClass} mt-1`}
            placeholder="לדוגמה: #2507, יוסי, תל אביב, 050…"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {SEARCH_SHORTCUTS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              className="rounded-full border border-white/15 px-3 py-1 text-xs font-bold text-cream/75"
              onClick={() => {
                desktopSearchRef.current?.focus();
                if (chip.prefix === "#" && !searchQuery.startsWith("#")) {
                  setSearchQuery("#");
                }
              }}
            >
              {chip.label}
            </button>
          ))}
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
                  {isCommissionPending(ride) ? (
                    <p className="mt-1 text-[10px] font-bold text-amber-300">עמלה פתוחה לגבייה</p>
                  ) : null}
                </td>
                <td className="px-2 py-3">
                  {ride.basePrice || ride.agreedPrice ? `${ride.basePrice || ride.agreedPrice} ₪` : "—"}
                </td>
                <td className="px-2 py-3">
                  <select
                    className="min-h-10 rounded-lg border border-white/15 bg-ink/70 px-2"
                    value={ride.status}
                    onChange={(event) => patchRideStatus(ride.id, event.target.value)}
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
            <p className="mt-2 text-sm">
              {ride.pickup || ride.origin} → {ride.destination}
            </p>
            <p className="text-xs text-cream/60">{ride.dateTime?.replace("T", " ") || "—"}</p>
            <select
              className={`${inputClass} mt-2 min-h-10`}
              value={ride.status}
              onChange={(event) => patchRideStatus(ride.id, event.target.value)}
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

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-2">
          <button type="button" className="btn-primary min-h-12 px-2 text-xs font-bold" onClick={() => setShowModal(true)}>
            + נסיעה חדשה
          </button>
          <button type="button" className="btn-secondary min-h-12 px-2 text-xs font-bold" onClick={focusSearch}>
            חיפוש # / נהג / עיר
          </button>
          <button
            type="button"
            className="btn-outline-gold min-h-12 px-2 text-xs font-bold"
            onClick={() => setShowTodayModal(true)}
          >
            סיכום היום
          </button>
        </div>
      </div>

      {showMobileSearch && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 p-4 md:hidden">
          <div className="glass-card p-4">
            <p className="text-sm font-extrabold">חיפוש מהיר</p>
            <input
              ref={searchInputRef}
              type="search"
              className={`${inputClass} mt-2`}
              placeholder="#2507, שם נהג, עיר…"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {SEARCH_SHORTCUTS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-bold"
                  onClick={() => {
                    if (chip.prefix === "#") setSearchQuery("#");
                    searchInputRef.current?.focus();
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn-primary mt-4 min-h-11 w-full"
              onClick={() => setShowMobileSearch(false)}
            >
              סגור
            </button>
          </div>
        </div>
      )}

      {showTodayModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
          <div className="glass-card w-full max-w-md p-5">
            <h3 className="text-lg font-extrabold">סיכום היום</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex justify-between">
                <span>סה״כ נסיעות היום</span>
                <span className="font-bold">{todaySummary.total}</span>
              </li>
              <li className="flex justify-between">
                <span>מתוכננות</span>
                <span className="font-bold">{todaySummary.scheduled}</span>
              </li>
              <li className="flex justify-between">
                <span>בוצעו / נמכרו לנהג</span>
                <span className="font-bold">{todaySummary.done}</span>
              </li>
              <li className="flex justify-between">
                <span>מחזור היום</span>
                <span className="font-bold text-gold">
                  {Math.round(todaySummary.gross).toLocaleString("he-IL")} ₪
                </span>
              </li>
              <li className="flex justify-between">
                <span>עמלות פתוחות מהיום</span>
                <span className="font-bold text-amber-200">{todaySummary.pendingToday}</span>
              </li>
            </ul>
            <button
              type="button"
              className="btn-primary mt-5 min-h-11 w-full"
              onClick={() => setShowTodayModal(false)}
            >
              סגור
            </button>
          </div>
        </div>
      )}

      {shareRide && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
          <div className="glass-card w-full max-w-lg p-5 sm:p-6">
            <h3 className="text-lg font-extrabold">שיתוף לקבוצת נהגים</h3>
            <p className="mt-1 font-mono text-sm text-gold">{shareRide.orderId}</p>
            <p className="mt-2 text-xs text-cream/55">בחר תבנית — ללא נתונים פנימיים (עמלה / רווח)</p>
            <div className="mt-4 space-y-2">
              {SHARE_TEMPLATES.map((template) => (
                <label
                  key={template.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 ${
                    shareTemplate === template.id ? "border-gold/60 bg-gold/10" : "border-white/15 bg-ink/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="share-template"
                    checked={shareTemplate === template.id}
                    onChange={() => setShareTemplate(template.id)}
                  />
                  <span className="text-sm font-bold">{template.label}</span>
                </label>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                className="btn-primary min-h-11 flex-1 px-4"
                onClick={() => {
                  openDriverGroupShare(shareRide, shareTemplate);
                  setShareRide(null);
                }}
              >
                שלח ב-WhatsApp
              </button>
              <button type="button" className="btn-secondary min-h-11 px-4" onClick={() => setShareRide(null)}>
                ביטול
              </button>
            </div>
          </div>
        </div>
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

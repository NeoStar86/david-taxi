import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSiteData } from "../context/SiteDataContext";
import { useLanguage } from "../context/LanguageContext";
import { changeAdminPassword, logoutAdmin } from "./auth";
import AdminAppearancePanel from "./AdminAppearancePanel";
import AdminCmsHeroPanel from "./AdminCmsHeroPanel";
import AdminImageField from "./AdminImageField";
import AdminRideLogPanel from "./AdminRideLogPanel";
import AdminVehiclesPanel from "./AdminVehiclesPanel";

const tabs = [
  { id: "general", label: "פרטים כלליים וקשר" },
  { id: "rides", label: "יומן נסיעות" },
  { id: "appearance", label: "עיצוב ונראות" },
  { id: "vehicles", label: "ניהול רכבים" },
  { id: "fare", label: "מחשבון מחירים" },
  { id: "media", label: "ניהול מדיה ותמונות" },
  { id: "testimonials", label: "המלצות לקוחות" },
  { id: "security", label: "אבטחת חשבון" },
];

const inputClass =
  "mt-2 w-full min-h-12 rounded-xl border border-white/15 bg-ink/80 px-4 py-3 text-base outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

export default function AdminDashboard({ onLogout }) {
  const { t } = useLanguage();
  const { data, notice, saveAll } = useSiteData();
  const [activeTab, setActiveTab] = useState("general");
  const [draft, setDraft] = useState(data);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityFeedback, setSecurityFeedback] = useState({ type: "", text: "" });

  useEffect(() => {
    setDraft(data);
  }, [data]);

  function persist(nextDraft) {
    setDraft(nextDraft);
    saveAll(nextDraft);
  }

  function updateMediaField(key, value, { persist: shouldPersist = false } = {}) {
    const nextDraft = {
      ...draft,
      media: { ...draft.media, [key]: value },
    };
    setDraft(nextDraft);
    if (shouldPersist) {
      saveAll(nextDraft);
    }
  }

  function updateVehicleField(vehicleId, patch, { persist: shouldPersist = false } = {}) {
    const nextDraft = {
      ...draft,
      vehicles: (draft.vehicles ?? []).map((vehicle) =>
        vehicle.id === vehicleId ? { ...vehicle, ...patch } : vehicle,
      ),
    };
    setDraft(nextDraft);
    if (shouldPersist) {
      saveAll(nextDraft);
    }
  }

  function updateVehicleName(vehicleId, lang, value) {
    setDraft((current) => ({
      ...current,
      vehicles: (current.vehicles ?? []).map((vehicle) =>
        vehicle.id === vehicleId
          ? { ...vehicle, names: { ...vehicle.names, [lang]: value } }
          : vehicle,
      ),
    }));
  }

  function handleLogout() {
    logoutAdmin();
    onLogout?.();
  }

  function handleChangePassword(event) {
    event.preventDefault();
    setSecurityFeedback({ type: "", text: "" });

    const result = changeAdminPassword(currentPassword, newPassword, confirmPassword);
    if (!result.ok) {
      setSecurityFeedback({ type: "error", text: result.error });
      return;
    }

    setSecurityFeedback({ type: "success", text: result.message });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="min-h-screen bg-ink text-cream" dir="rtl">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <div>
            <p className="text-sm font-extrabold">{t("admin.title")}</p>
            <p className="text-xs text-cream/60">{t("admin.subtitle")}</p>
          </div>
          <div className="ms-auto flex items-center gap-2">
            <Link to="/" className="btn-secondary min-h-12 px-4 text-sm">
              {t("admin.viewSite")}
            </Link>
            <button type="button" onClick={handleLogout} className="btn-outline-gold min-h-12 px-4 text-sm">
              {t("admin.logout")}
            </button>
          </div>
        </div>
      </header>

      {notice && (
        <div className="border-b border-gold/30 bg-gold/15 px-4 py-2 text-center text-sm font-bold text-gold">
          {notice}
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-12 shrink-0 rounded-full px-4 text-sm font-bold transition ${
                activeTab === tab.id ? "bg-gold text-ink" : "border border-white/15 bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="glass-card mt-4 p-5 sm:p-7">
          {activeTab === "general" && (
            <section className="space-y-6">
              <h2 className="text-xl font-extrabold">פרטים כלליים וקשר</h2>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-ink/40 p-4 sm:col-span-2">
                  <p className="text-sm font-extrabold">מונה פניות (לחיצות באתר)</p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/5 px-4 py-3 text-center">
                      <p className="text-2xl font-extrabold text-gold">{draft.analytics?.callClicks ?? 0}</p>
                      <p className="text-xs text-cream/60">לחיצות חיוג</p>
                    </div>
                    <div className="rounded-xl bg-white/5 px-4 py-3 text-center">
                      <p className="text-2xl font-extrabold text-gold">{draft.analytics?.whatsappClicks ?? 0}</p>
                      <p className="text-xs text-cream/60">לחיצות WhatsApp</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-ink/40 p-4 sm:col-span-2">
                  <p className="text-sm font-extrabold">באנר מבצעים מתחלף</p>
                  <label className="mt-3 flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="h-5 w-5 accent-gold"
                      checked={Boolean(draft.announcement?.enabled)}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          announcement: { ...current.announcement, enabled: event.target.checked },
                        }))
                      }
                    />
                    <span className="text-sm font-bold">הצגת באנר הודעה בראש האתר</span>
                  </label>
                  <label className="mt-3 block">
                    <span className="text-xs font-bold text-cream/60">טקסט המבצע</span>
                    <input
                      className={inputClass}
                      value={draft.announcement?.message ?? ""}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          announcement: { ...current.announcement, message: event.target.value },
                        }))
                      }
                      placeholder="הנחה מיוחדת להזמנות הלילה!"
                    />
                  </label>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["phoneDisplay", "טלפון לחיוג"],
                  ["phoneTel", "טלפון (tel)"],
                  ["whatsapp", "WhatsApp"],
                  ["email", "אימייל"],
                  ["address", "כתובת העסק"],
                  ["hours", "שעות פעילות"],
                ].map(([key, label]) => (
                  <label key={key} className="block">
                    <span className="text-sm font-bold">{label}</span>
                    <input
                      className={inputClass}
                      value={draft.site[key] ?? ""}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          site: { ...current.site, [key]: event.target.value },
                        }))
                      }
                    />
                  </label>
                ))}
              </div>

              <AdminCmsHeroPanel draft={draft} setDraft={setDraft} persist={persist} />

              <button type="button" className="btn-primary min-h-12 px-6" onClick={() => persist(draft)}>
                שמור שינויים
              </button>
            </section>
          )}

          {activeTab === "rides" && (
            <AdminRideLogPanel draft={draft} setDraft={setDraft} persist={persist} />
          )}

          {activeTab === "appearance" && (
            <AdminAppearancePanel draft={draft} setDraft={setDraft} persist={persist} />
          )}

          {activeTab === "vehicles" && (
            <AdminVehiclesPanel
              draft={draft}
              setDraft={setDraft}
              persist={persist}
              updateVehicleField={updateVehicleField}
              updateVehicleName={updateVehicleName}
            />
          )}

          {activeTab === "fare" && (
            <section className="space-y-4">
              <h2 className="text-xl font-extrabold">מחשבון מחירים</h2>

              <div className="rounded-2xl border border-white/10 bg-ink/40 p-4">
                <p className="text-sm font-extrabold">תוספת לילה / סופ״ש (Surge)</p>
                <label className="mt-3 flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-gold"
                    checked={Boolean(draft.fare.surge?.enabled)}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        fare: {
                          ...current.fare,
                          surge: { ...current.fare.surge, enabled: event.target.checked },
                        },
                      }))
                    }
                  />
                  <span className="text-sm font-bold">הפעלת תוספת אחוזית לאומדן המחיר</span>
                </label>
                <label className="mt-3 block max-w-xs">
                  <span className="text-xs font-bold text-cream/60">אחוז תוספת (לדוגמה 20 = +20%)</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className={inputClass}
                    value={draft.fare.surge?.percent ?? 20}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        fare: {
                          ...current.fare,
                          surge: { ...current.fare.surge, percent: Number(event.target.value) },
                        },
                      }))
                    }
                  />
                </label>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-cream/70">
                      <th className="px-2 py-2 text-start">מוצא</th>
                      <th className="px-2 py-2 text-start">יעד</th>
                      <th className="px-2 py-2 text-start">מ-₪</th>
                      <th className="px-2 py-2 text-start">עד-₪</th>
                      <th className="px-2 py-2 text-start">ETA (דק)</th>
                      <th className="px-2 py-2 text-start">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draft.fare.routes.map((route) => (
                      <tr key={route.id} className="border-b border-white/5">
                        {["origin", "destination", "min", "max", "minutes"].map((field) => (
                          <td key={field} className="px-2 py-2">
                            <input
                              type={field === "origin" || field === "destination" ? "text" : "number"}
                              className="min-h-10 w-full rounded-lg border border-white/15 bg-ink/70 px-2"
                              value={route[field]}
                              onChange={(event) =>
                                setDraft((current) => ({
                                  ...current,
                                  fare: {
                                    ...current.fare,
                                    routes: current.fare.routes.map((row) =>
                                      row.id === route.id
                                        ? {
                                            ...row,
                                            [field]:
                                              field === "origin" || field === "destination"
                                                ? event.target.value
                                                : Number(event.target.value),
                                          }
                                        : row,
                                    ),
                                  },
                                }))
                              }
                            />
                          </td>
                        ))}
                        <td className="px-2 py-2">
                          <button
                            type="button"
                            className="text-xs font-bold text-gold"
                            onClick={() =>
                              setDraft((current) => ({
                                ...current,
                                fare: {
                                  ...current.fare,
                                  routes: current.fare.routes.filter((row) => row.id !== route.id),
                                },
                              }))
                            }
                          >
                            מחק
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                className="btn-outline-gold min-h-12 px-4 text-sm"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    fare: {
                      ...current.fare,
                      routes: [
                        ...current.fare.routes,
                        {
                          id: `route-${Date.now()}`,
                          origin: "תל אביב",
                          destination: 'נתב"ג',
                          min: 140,
                          max: 170,
                          minutes: 25,
                        },
                      ],
                    },
                  }))
                }
              >
                הוספת מסלול
              </button>
              <button type="button" className="btn-primary ms-2 min-h-12 px-6" onClick={() => persist(draft)}>
                עדכן מחירון
              </button>
            </section>
          )}

          {activeTab === "media" && (
            <section className="space-y-4">
              <h2 className="text-xl font-extrabold">ניהול מדיה ותמונות</h2>
              <p className="text-sm text-cream/65">
                העלאה מהגלריה נשמרת מיד ב-localStorage ומתעדכנת באתר. תמונות מכווצות אוטומטית לשמירה במכשיר.
              </p>
              {[
                ["heroImage", "תמונת Hero"],
                ["carPhoto", "תמונת רכב"],
                ["logoUrl", "לוגו"],
              ].map(([key, label]) => (
                <AdminImageField
                  key={key}
                  label={label}
                  value={draft.media[key] ?? ""}
                  onUpdate={(value, options) => updateMediaField(key, value, options)}
                />
              ))}
              <button type="button" className="btn-primary min-h-12 px-6" onClick={() => persist(draft)}>
                שמור קישורי URL
              </button>
            </section>
          )}

          {activeTab === "testimonials" && (
            <section className="space-y-4">
              <h2 className="text-xl font-extrabold">המלצות לקוחות</h2>
              {draft.testimonials.map((item) => (
                <article key={item.id} className="rounded-2xl border border-white/10 bg-ink/40 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-bold">שם</span>
                      <input
                        className={inputClass}
                        value={item.name}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            testimonials: current.testimonials.map((row) =>
                              row.id === item.id ? { ...row, name: event.target.value } : row,
                            ),
                          }))
                        }
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold">דירוג (1-5)</span>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        className={inputClass}
                        value={item.rating}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            testimonials: current.testimonials.map((row) =>
                              row.id === item.id ? { ...row, rating: Number(event.target.value) } : row,
                            ),
                          }))
                        }
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="text-xs font-bold">טקסט ביקורת</span>
                      <textarea
                        rows={3}
                        className={`${inputClass} min-h-[96px] resize-y`}
                        value={item.quote}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            testimonials: current.testimonials.map((row) =>
                              row.id === item.id ? { ...row, quote: event.target.value } : row,
                            ),
                          }))
                        }
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn-outline-gold mt-3 min-h-12 px-4 text-sm"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        testimonials: current.testimonials.filter((row) => row.id !== item.id),
                      }))
                    }
                  >
                    מחק
                  </button>
                </article>
              ))}
              <button
                type="button"
                className="btn-outline-gold min-h-12 px-4 text-sm"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    testimonials: [
                      ...current.testimonials,
                      {
                        id: `t-${Date.now()}`,
                        name: "לקוח/ה",
                        quote: "ביקורת חדשה",
                        rating: 5,
                        visible: true,
                      },
                    ],
                  }))
                }
              >
                הוספת ביקורת
              </button>
              <button type="button" className="btn-primary ms-2 min-h-12 px-6" onClick={() => persist(draft)}>
                שמור שינויים
              </button>
            </section>
          )}

          {activeTab === "security" && (
            <section className="space-y-4">
              <h2 className="text-xl font-extrabold">אבטחת חשבון</h2>
              <p className="text-sm text-cream/70">
                הסיסמה נשמרת במכשיר זה בלבד (localStorage). ברירת המחדל הראשונית היא 1234.
              </p>

              <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                <label className="block">
                  <span className="text-sm font-bold">סיסמה נוכחית</span>
                  <input
                    type="password"
                    className={inputClass}
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold">סיסמה חדשה</span>
                  <input
                    type="password"
                    className={inputClass}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold">אימות סיסמה חדשה</span>
                  <input
                    type="password"
                    className={inputClass}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </label>

                {securityFeedback.text && (
                  <p
                    className={`text-sm font-semibold ${
                      securityFeedback.type === "success" ? "text-emerald-300" : "text-gold"
                    }`}
                    role="alert"
                  >
                    {securityFeedback.text}
                  </p>
                )}

                <button type="submit" className="btn-primary min-h-12 px-6">
                  שנה סיסמה
                </button>
              </form>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

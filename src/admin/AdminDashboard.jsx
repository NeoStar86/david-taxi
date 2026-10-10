import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSiteData } from "../context/SiteDataContext";
import { changeAdminPassword, logoutAdmin } from "./auth";

const tabs = [
  { id: "general", label: "פרטים כלליים וקשר" },
  { id: "fare", label: "מחשבון מחירים" },
  { id: "media", label: "ניהול מדיה ותמונות" },
  { id: "testimonials", label: "המלצות לקוחות" },
  { id: "security", label: "אבטחת חשבון" },
];

const inputClass =
  "mt-2 w-full min-h-12 rounded-xl border border-white/15 bg-ink/80 px-4 py-3 text-base outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

export default function AdminDashboard({ onLogout }) {
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
            <p className="text-sm font-extrabold">לוח ניהול · דוד מוניות והסעות</p>
            <p className="text-xs text-cream/60">עדכון תוכן האתר בזמן אמת</p>
          </div>
          <div className="ms-auto flex items-center gap-2">
            <Link to="/" className="btn-secondary min-h-12 px-4 text-sm">
              צפייה באתר
            </Link>
            <button type="button" onClick={handleLogout} className="btn-outline-gold min-h-12 px-4 text-sm">
              התנתקות
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
            <section className="space-y-4">
              <h2 className="text-xl font-extrabold">פרטים כלליים וקשר</h2>
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
                <label className="block sm:col-span-2">
                  <span className="text-sm font-bold">כותרת ראשית</span>
                  <input
                    className={inputClass}
                    value={draft.site.heroTitle ?? ""}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        site: { ...current.site, heroTitle: event.target.value },
                      }))
                    }
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-bold">תת-כותרת</span>
                  <textarea
                    rows={3}
                    className={`${inputClass} min-h-[96px] resize-y`}
                    value={draft.site.heroSubtitle ?? ""}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        site: { ...current.site, heroSubtitle: event.target.value },
                      }))
                    }
                  />
                </label>
              </div>
              <button type="button" className="btn-primary min-h-12 px-6" onClick={() => persist(draft)}>
                שמור שינויים
              </button>
            </section>
          )}

          {activeTab === "fare" && (
            <section className="space-y-4">
              <h2 className="text-xl font-extrabold">מחשבון מחירים</h2>
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
              {[
                ["heroImage", "תמונת Hero (URL)"],
                ["carPhoto", "תמונת רכב (URL)"],
                ["logoUrl", "לוגו (URL)"],
              ].map(([key, label]) => (
                <div key={key} className="rounded-2xl border border-white/10 bg-ink/40 p-4">
                  <label className="block">
                    <span className="text-sm font-bold">{label}</span>
                    <input
                      className={inputClass}
                      value={draft.media[key] ?? ""}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          media: { ...current.media, [key]: event.target.value },
                        }))
                      }
                      placeholder="https://..."
                    />
                  </label>
                  {draft.media[key] ? (
                    <img
                      src={draft.media[key]}
                      alt={label}
                      className="mt-3 h-28 w-full rounded-xl border border-white/10 object-cover"
                      onError={(event) => {
                        event.currentTarget.classList.add("hidden");
                      }}
                    />
                  ) : (
                    <p className="mt-2 text-xs text-cream/50">אין תצוגה מקדימה</p>
                  )}
                </div>
              ))}
              <button type="button" className="btn-primary min-h-12 px-6" onClick={() => persist(draft)}>
                שמור שינויים
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

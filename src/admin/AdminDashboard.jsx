import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSiteData } from "../context/SiteDataContext";
import { logoutAdmin } from "./auth";

const tabs = [
  { id: "general", label: "הגדרות כלליות" },
  { id: "fare", label: "מחשבון מחירים" },
  { id: "testimonials", label: "לקוחות ממליצים" },
  { id: "availability", label: "זמינות" },
  { id: "leads", label: "פניות" },
];

const inputClass =
  "mt-2 w-full min-h-12 rounded-xl border border-white/15 bg-ink/80 px-4 py-3 text-base outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

export default function AdminDashboard({ onLogout }) {
  const { data, notice, setNotice, saveAll, updateLeadStatus } = useSiteData();
  const [tab, setTab] = useState("general");
  const [draft, setDraft] = useState(data);

  useEffect(() => {
    setDraft(data);
  }, [data]);

  function saveDraft(nextDraft = draft) {
    saveAll({ ...nextDraft, leads: data.leads });
  }

  function logout() {
    logoutAdmin();
    onLogout?.();
  }

  return (
    <div className="min-h-screen bg-ink text-cream">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold">לוח ניהול · דוד מוניות והסעות</p>
            <p className="text-xs text-cream/60">עריכת תוכן דינמי</p>
          </div>
          <div className="ms-auto flex items-center gap-2">
            <Link to="/" className="btn-secondary min-h-12 px-4 text-sm">
              לאתר
            </Link>
            <button type="button" onClick={logout} className="btn-outline-gold min-h-12 px-4 text-sm">
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
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`min-h-12 shrink-0 rounded-full px-4 text-sm font-bold transition ${
                tab === item.id ? "bg-gold text-ink" : "border border-white/15 bg-white/5 text-cream"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="glass-card mt-4 p-5 sm:p-7">
          {tab === "general" && (
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["phoneDisplay", "טלפון לתצוגה"],
                ["phoneTel", "טלפון לחיוג (tel)"],
                ["whatsapp", "WhatsApp (מספר בינלאומי ללא +)"],
                ["email", "אימייל"],
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
                <span className="text-sm font-bold">כותרת ראשית (Hero)</span>
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
                <span className="text-sm font-bold">תת-כותרת (Hero)</span>
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
          )}

          {tab === "fare" && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-cream/70">
                      <th className="px-2 py-2 text-start">מוצא</th>
                      <th className="px-2 py-2 text-start">יעד</th>
                      <th className="px-2 py-2 text-start">מ-₪</th>
                      <th className="px-2 py-2 text-start">עד-₪</th>
                      <th className="px-2 py-2 text-start">דקות</th>
                      <th className="px-2 py-2 text-start">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draft.fare.routes.map((route) => (
                      <tr key={route.id} className="border-b border-white/5">
                        <td className="px-2 py-2">
                          <input
                            className="min-h-10 w-full rounded-lg border border-white/15 bg-ink/70 px-2"
                            value={route.origin}
                            onChange={(event) =>
                              setDraft((current) => ({
                                ...current,
                                fare: {
                                  ...current.fare,
                                  routes: current.fare.routes.map((item) =>
                                    item.id === route.id ? { ...item, origin: event.target.value } : item,
                                  ),
                                },
                              }))
                            }
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            className="min-h-10 w-full rounded-lg border border-white/15 bg-ink/70 px-2"
                            value={route.destination}
                            onChange={(event) =>
                              setDraft((current) => ({
                                ...current,
                                fare: {
                                  ...current.fare,
                                  routes: current.fare.routes.map((item) =>
                                    item.id === route.id ? { ...item, destination: event.target.value } : item,
                                  ),
                                },
                              }))
                            }
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            className="min-h-10 w-20 rounded-lg border border-white/15 bg-ink/70 px-2"
                            value={route.min}
                            onChange={(event) =>
                              setDraft((current) => ({
                                ...current,
                                fare: {
                                  ...current.fare,
                                  routes: current.fare.routes.map((item) =>
                                    item.id === route.id ? { ...item, min: Number(event.target.value) } : item,
                                  ),
                                },
                              }))
                            }
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            className="min-h-10 w-20 rounded-lg border border-white/15 bg-ink/70 px-2"
                            value={route.max}
                            onChange={(event) =>
                              setDraft((current) => ({
                                ...current,
                                fare: {
                                  ...current.fare,
                                  routes: current.fare.routes.map((item) =>
                                    item.id === route.id ? { ...item, max: Number(event.target.value) } : item,
                                  ),
                                },
                              }))
                            }
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            className="min-h-10 w-20 rounded-lg border border-white/15 bg-ink/70 px-2"
                            value={route.minutes}
                            onChange={(event) =>
                              setDraft((current) => ({
                                ...current,
                                fare: {
                                  ...current.fare,
                                  routes: current.fare.routes.map((item) =>
                                    item.id === route.id ? { ...item, minutes: Number(event.target.value) } : item,
                                  ),
                                },
                              }))
                            }
                          />
                        </td>
                        <td className="px-2 py-2">
                          <button
                            type="button"
                            className="text-xs font-bold text-gold"
                            onClick={() =>
                              setDraft((current) => ({
                                ...current,
                                fare: {
                                  ...current.fare,
                                  routes: current.fare.routes.filter((item) => item.id !== route.id),
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
            </div>
          )}

          {tab === "testimonials" && (
            <div className="space-y-4">
              {draft.testimonials.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-ink/50 p-4">
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
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn-secondary min-h-12 px-4 text-sm"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          testimonials: current.testimonials.map((row) =>
                            row.id === item.id ? { ...row, visible: !row.visible } : row,
                          ),
                        }))
                      }
                    >
                      {item.visible ? "הסתר מהאתר" : "הצג באתר"}
                    </button>
                    <button
                      type="button"
                      className="btn-outline-gold min-h-12 px-4 text-sm"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          testimonials: current.testimonials.filter((row) => row.id !== item.id),
                        }))
                      }
                    >
                      מחק
                    </button>
                  </div>
                </div>
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
            </div>
          )}

          {tab === "availability" && (
            <div>
              <p className="text-sm text-cream/70">הסטטוס יוצג כתג צף באתר הראשי.</p>
              <button
                type="button"
                className={`mt-5 min-h-12 rounded-full px-6 text-sm font-extrabold transition ${
                  draft.availability.isAvailable ? "bg-gold text-ink" : "bg-red-500/90 text-white"
                }`}
                onClick={() => {
                  const nextDraft = {
                    ...draft,
                    availability: { isAvailable: !draft.availability.isAvailable },
                  };
                  setDraft(nextDraft);
                  saveDraft(nextDraft);
                }}
              >
                {draft.availability.isAvailable ? "זמין כעת נסיעות" : "לא זמין כעת"}
              </button>
            </div>
          )}

          {tab === "leads" && (
            <div className="space-y-3">
              {data.leads.length === 0 && <p className="text-sm text-cream/60">אין פניות עדיין.</p>}
              {data.leads.map((lead) => (
                <article key={lead.id} className="rounded-2xl border border-white/10 bg-ink/50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-cream/60">{new Date(lead.createdAt).toLocaleString("he-IL")}</p>
                    <select
                      className="min-h-10 rounded-lg border border-white/15 bg-ink px-3 text-sm"
                      value={lead.status}
                      onChange={(event) => updateLeadStatus(lead.id, event.target.value)}
                    >
                      <option value="חדש">חדש</option>
                      <option value="טופל">טופל</option>
                    </select>
                  </div>
                  <p className="mt-2 text-sm font-bold text-gold">{lead.source}</p>
                  <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-cream/75">
                    {JSON.stringify(lead.payload ?? {}, null, 2)}
                  </pre>
                </article>
              ))}
            </div>
          )}

          {tab !== "leads" && (
            <button type="button" onClick={saveDraft} className="btn-primary mt-6 min-h-12 px-6">
              שמירת שינויים
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

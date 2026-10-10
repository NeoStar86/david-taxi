import { useState } from "react";
import { site } from "../content";
import { buildBookingWhatsAppUrl } from "../utils/whatsappBooking";

const emptyForm = {
  fullName: "",
  phone: "",
  pickup: "",
  destination: "",
  dateTime: "",
  notes: "",
};

const fieldClass =
  "mt-2 w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-base text-cream outline-none transition placeholder:text-cream/35 focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

export default function Contact() {
  const [form, setForm] = useState(emptyForm);

  function updateField(field) {
    return (event) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };
  }

  function handleSubmit(event) {
    event.preventDefault();
    const url = buildBookingWhatsAppUrl(form);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="contact" className="bg-ink py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-14">
          <div>
            <p className="text-sm font-bold text-gold">צור קשר</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              להזמנת נסיעה / קבלת הצעת מחיר
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-cream/70">
              ממלאים את הפרטים, ונפתחת הודעת WhatsApp מוכנה לשליחה. {site.hours}.
            </p>
            <div className="mt-8 space-y-3 text-sm text-cream/75">
              <p>
                <span className="font-bold text-cream">טלפון: </span>
                <a href={`tel:${site.phoneTel}`} className="hover:text-gold">
                  {site.phoneDisplay}
                </a>
              </p>
              <p>
                <span className="font-bold text-cream">WhatsApp: </span>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold"
                >
                  {site.phoneDisplay}
                </a>
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-gold/25 bg-panel p-6 sm:p-8"
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-sm font-bold text-cream">שם מלא</span>
                <input
                  type="text"
                  name="fullName"
                  autoComplete="name"
                  required
                  value={form.fullName}
                  onChange={updateField("fullName")}
                  className={fieldClass}
                  placeholder="הכניסו שם מלא"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-cream">טלפון</span>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  required
                  dir="ltr"
                  value={form.phone}
                  onChange={updateField("phone")}
                  className={`${fieldClass} text-start`}
                  placeholder="050-0000000"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-cream">תאריך ושעה</span>
                <input
                  type="datetime-local"
                  name="dateTime"
                  required
                  dir="ltr"
                  value={form.dateTime}
                  onChange={updateField("dateTime")}
                  className={`${fieldClass} text-start`}
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-bold text-cream">נקודת איסוף</span>
                <input
                  type="text"
                  name="pickup"
                  required
                  value={form.pickup}
                  onChange={updateField("pickup")}
                  className={fieldClass}
                  placeholder="רחוב, עיר, נקודת מפגש"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-bold text-cream">יעד נסיעה</span>
                <input
                  type="text"
                  name="destination"
                  required
                  value={form.destination}
                  onChange={updateField("destination")}
                  className={fieldClass}
                  placeholder="לאן מגיעים?"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-bold text-cream">
                  הערות נוספות <span className="font-normal text-cream/50">(אופציונלי)</span>
                </span>
                <textarea
                  name="notes"
                  rows={3}
                  value={form.notes}
                  onChange={updateField("notes")}
                  className={`${fieldClass} resize-y min-h-[96px]`}
                  placeholder="מספר נוסעים, מזוודות, הערות מיוחדות..."
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 flex w-full min-h-14 items-center justify-center rounded-full bg-[#25D366] px-6 text-base font-extrabold text-white shadow-[0_12px_30px_rgba(37,211,102,0.25)] transition hover:bg-[#1da851] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
            >
              שלח לבדיקת מחיר ב-WhatsApp
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

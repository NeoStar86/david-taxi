import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useSiteData } from "../context/SiteDataContext";
import ShareLocationButton from "./ShareLocationButton";
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
  const { data, addLead, recordClick } = useSiteData();
  const { site } = data;
  const { lang, t } = useLanguage();
  const [form, setForm] = useState(emptyForm);

  function updateField(field) {
    return (event) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };
  }

  function handleSubmit(event) {
    event.preventDefault();
    addLead({
      source: "טופס הזמנה",
      payload: { ...form },
    });
    const url = buildBookingWhatsAppUrl(form, site, lang);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="contact" className="bg-ink py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-14">
          <div>
            <p className="section-kicker">{t("contact.kicker")}</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{t("contact.title")}</h2>
            <p className="mt-4 text-lg leading-relaxed text-cream/70">
              {t("contact.subtitle")} {site.hours}.
            </p>
            {site.address && <p className="mt-2 text-sm text-cream/65">{site.address}</p>}
            <div className="mt-8 space-y-3 text-sm text-cream/75">
              <p>
                <span className="font-bold text-cream">{t("contact.phoneLabel")} </span>
                <a href={`tel:${site.phoneTel}`} onClick={() => recordClick("call")} className="hover:text-gold">
                  {site.phoneDisplay}
                </a>
              </p>
              <p>
                <span className="font-bold text-cream">{t("contact.whatsappLabel")} </span>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => recordClick("whatsapp")}
                  className="hover:text-gold"
                >
                  {site.phoneDisplay}
                </a>
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="glass-card rounded-[2rem] border-gold/25 p-6 sm:p-8"
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-sm font-bold text-cream">{t("contact.fullName")}</span>
                <input
                  type="text"
                  name="fullName"
                  autoComplete="name"
                  required
                  value={form.fullName}
                  onChange={updateField("fullName")}
                  className={fieldClass}
                  placeholder={t("contact.phName")}
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-cream">{t("contact.phone")}</span>
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
                <span className="text-sm font-bold text-cream">{t("contact.dateTime")}</span>
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
                <span className="text-sm font-bold text-cream">{t("contact.pickup")}</span>
                <input
                  type="text"
                  name="pickup"
                  required
                  value={form.pickup}
                  onChange={updateField("pickup")}
                  className={fieldClass}
                  placeholder={t("contact.phPickup")}
                />
              </label>

              <div className="sm:col-span-2">
                <ShareLocationButton fullWidth />
              </div>

              <label className="block sm:col-span-2">
                <span className="text-sm font-bold text-cream">{t("contact.destination")}</span>
                <input
                  type="text"
                  name="destination"
                  required
                  value={form.destination}
                  onChange={updateField("destination")}
                  className={fieldClass}
                  placeholder={t("contact.phDestination")}
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-bold text-cream">
                  {t("contact.notes")} <span className="font-normal text-cream/50">{t("contact.optional")}</span>
                </span>
                <textarea
                  name="notes"
                  rows={3}
                  value={form.notes}
                  onChange={updateField("notes")}
                  className={`${fieldClass} min-h-[96px] resize-y`}
                  placeholder={t("contact.phNotes")}
                />
              </label>
            </div>

            <button
              type="submit"
              className="btn-whatsapp mt-6 w-full min-h-14 px-6 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
            >
              {t("contact.submit")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

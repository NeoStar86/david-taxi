import { site } from "../content";
import CallNow, { WhatsAppButton } from "./CallNow";
import { SedanArt } from "./Icons";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-cream">
      <div className="pointer-events-none absolute -top-24 end-0 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 start-0 h-px w-full bg-gradient-to-l from-transparent via-gold/70 to-transparent" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-bold text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            {site.name} · {site.hours}
          </p>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            שירותי מוניות והסעות לכל חלקי הארץ
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/75 sm:text-xl">
            זמינות 24/7, הגעה בזמן ורכב חדיש ומרווח. הדרך הבטוחה והנוחה שלך לכל יעד.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <CallNow size="lg" className="w-full sm:w-auto" />
            <WhatsAppButton className="w-full sm:w-auto" />
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-panel p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-8">
          <div className="mb-2 flex items-center justify-between text-xs font-bold tracking-[0.18em]">
            <span className="rounded-md bg-gold px-3 py-1 text-ink">TAXI</span>
            <span className="text-cream/50">רכב מרווח</span>
          </div>
          <SedanArt />
          <div className="mx-auto mt-1 flex w-fit items-center gap-3 rounded-lg bg-cream px-4 py-2 text-ink">
            <span className="text-xs font-extrabold text-gold-deep">IL</span>
            <span className="text-base font-extrabold tracking-wide sm:text-lg">דוד · כל הארץ</span>
          </div>
        </div>
      </div>
    </section>
  );
}

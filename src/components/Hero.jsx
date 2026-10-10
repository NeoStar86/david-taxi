import { useSiteData } from "../context/SiteDataContext";
import CallNow, { WhatsAppButton } from "./CallNow";
import SaveContactButton from "./SaveContactButton";
import ShareLocationButton from "./ShareLocationButton";
import { SedanArt } from "./Icons";

export default function Hero() {
  const { data } = useSiteData();
  const { site, media } = data;

  return (
    <section
      className="relative overflow-hidden bg-ink text-cream"
      style={
        media.heroImage
          ? {
              backgroundImage: `linear-gradient(rgba(7,7,8,0.82), rgba(7,7,8,0.92)), url(${media.heroImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="pointer-events-none absolute -top-24 end-0 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 start-0 h-px w-full bg-gradient-to-l from-transparent via-gold/70 to-transparent" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
        <div>
          <p className="glass-card mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            {site.name} · {site.hours}
          </p>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            {site.heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/75 sm:text-xl">
            {site.heroSubtitle}
          </p>
          {site.address && <p className="mt-3 text-sm text-cream/60">{site.address}</p>}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <CallNow size="lg" className="w-full sm:w-auto" />
            <WhatsAppButton className="w-full sm:w-auto" />
          </div>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <SaveContactButton className="w-full sm:w-auto" />
            <ShareLocationButton className="w-full md:hidden" fullWidth />
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-6 sm:p-8">
          <div className="mb-2 flex items-center justify-between text-xs font-bold tracking-[0.18em]">
            <span className="rounded-md bg-gold px-3 py-1 text-ink">TAXI</span>
            <span className="text-cream/50">רכב מרווח</span>
          </div>
          {media.carPhoto ? (
            <img src={media.carPhoto} alt="תמונת רכב" className="w-full rounded-xl object-cover" />
          ) : (
            <SedanArt />
          )}
          <div className="mx-auto mt-1 flex w-fit items-center gap-3 rounded-lg bg-cream px-4 py-2 text-ink">
            <span className="text-xs font-extrabold text-gold-deep">IL</span>
            <span className="text-base font-extrabold tracking-wide sm:text-lg">דוד · כל הארץ</span>
          </div>
        </div>
      </div>
    </section>
  );
}

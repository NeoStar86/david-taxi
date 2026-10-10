import { useEffect, useState } from "react";
import { useSiteData } from "../context/SiteDataContext";
import CallNow from "./CallNow";
import { LogoMark } from "./Icons";

export default function Navbar() {
  const { data } = useSiteData();
  const { site, media, availability, static: staticContent } = data;
  const available = availability?.isAvailable !== false;
  const { navLinks } = staticContent;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/80 text-cream backdrop-blur-xl">
      <div
        className={`border-b px-4 py-1.5 text-center text-xs font-extrabold sm:text-sm ${
          available
            ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
            : "border-red-400/25 bg-red-500/10 text-red-200"
        }`}
      >
        <span className="inline-flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${available ? "animate-pulse bg-emerald-300" : "bg-red-300"}`}
          />
          {available ? "זמין כעת לנסיעות" : "לא זמין כעת — נסו שוב מאוחר יותר"}
        </span>
      </div>
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <a href="#top" className="flex min-w-0 items-center gap-2.5 sm:gap-3" onClick={close}>
          {media.logoUrl ? (
            <img src={media.logoUrl} alt={site.name} className="h-10 w-10 shrink-0 rounded-xl object-cover sm:h-11 sm:w-11" />
          ) : (
            <LogoMark className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" />
          )}
          <span className="min-w-0 leading-tight">
            <span className="block text-sm font-extrabold tracking-tight sm:text-base lg:text-lg">
              {site.name}
            </span>
            <span className="mt-0.5 block text-[10px] font-semibold tracking-[0.16em] text-gold sm:text-[11px]">
              {site.nameEn}
            </span>
          </span>
        </a>

        <div className="ms-auto flex items-center gap-2 lg:gap-8">
          <nav className="hidden items-center gap-6 xl:gap-7 lg:flex" aria-label="ניווט ראשי">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-cream/80 transition hover:text-gold"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <CallNow />
          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-cream lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={`absolute inset-x-0 h-0.5 bg-current transition ${open ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute inset-x-0 top-1.5 h-0.5 bg-current transition ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute inset-x-0 h-0.5 bg-current transition ${open ? "top-1.5 -rotate-45" : "top-3"}`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          className="border-t border-white/10 bg-ink px-4 py-3 lg:hidden"
          aria-label="ניווט לנייד"
        >
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={close}
                  className="block border-b border-white/10 py-3.5 text-base font-semibold text-cream"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

import { LOCALE_META, SUPPORTED_LANGS } from "../i18n/translations";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/15 bg-ink/60 p-1">
      {SUPPORTED_LANGS.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          className={`min-h-9 rounded-full px-2.5 text-[11px] font-extrabold transition sm:px-3 sm:text-xs ${
            lang === code ? "bg-gold text-ink" : "text-cream/75 hover:text-gold"
          }`}
          aria-pressed={lang === code}
        >
          {LOCALE_META[code].label}
        </button>
      ))}
    </div>
  );
}

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getLocalizedContent } from "../i18n/localizedContent.js";
import { LOCALE_META, SUPPORTED_LANGS, t as translate } from "../i18n/translations.js";

const LANG_KEY = "site_lang";
const LEGACY_LANG_KEY = "david-taxi-lang";
const LanguageContext = createContext(null);

function readStoredLang() {
  if (typeof window === "undefined") return "he";
  const stored = localStorage.getItem(LANG_KEY) || localStorage.getItem(LEGACY_LANG_KEY);
  return SUPPORTED_LANGS.includes(stored) ? stored : "he";
}

function applyDocumentLanguage(lang) {
  const meta = LOCALE_META[lang] ?? LOCALE_META.he;
  document.documentElement.lang = lang;
  document.documentElement.dir = meta.dir;
}

if (typeof document !== "undefined") {
  applyDocumentLanguage(readStoredLang());
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLang);

  useEffect(() => {
    applyDocumentLanguage(lang);
    localStorage.setItem(LANG_KEY, lang);
    localStorage.removeItem(LEGACY_LANG_KEY);
  }, [lang]);

  const api = useMemo(
    () => ({
      lang,
      dir: LOCALE_META[lang]?.dir ?? "rtl",
      setLang: (next) => {
        if (SUPPORTED_LANGS.includes(next)) {
          setLangState(next);
        }
      },
      t: (key, vars) => translate(lang, key, vars),
      content: getLocalizedContent(lang),
    }),
    [lang],
  );

  return <LanguageContext.Provider value={api}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

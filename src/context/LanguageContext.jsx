import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LOCALE_META, SUPPORTED_LANGS, t as translate } from "../i18n/translations";

const LANG_KEY = "david-taxi-lang";
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window === "undefined") return "he";
    const stored = localStorage.getItem(LANG_KEY);
    return SUPPORTED_LANGS.includes(stored) ? stored : "he";
  });

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    const meta = LOCALE_META[lang] ?? LOCALE_META.he;
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;
  }, [lang]);

  const api = useMemo(
    () => ({
      lang,
      dir: LOCALE_META[lang]?.dir ?? "rtl",
      setLang: setLangState,
      t: (key, vars) => translate(lang, key, vars),
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

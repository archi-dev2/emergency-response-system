"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  TRANSLATIONS,
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  type Language,
  type Translations,
} from "./translations";

// ─── Context shape ────────────────────────────────────────────────────────────

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: TRANSLATIONS[DEFAULT_LANGUAGE],
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(
        LANGUAGE_STORAGE_KEY,
      ) as Language | null;
      if (stored && stored in TRANSLATIONS) return stored;
    }
    return DEFAULT_LANGUAGE;
  });

  // Persist to localStorage whenever the language changes
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  }, []);

  // Sync across tabs: if another tab switches language, update here too
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === LANGUAGE_STORAGE_KEY &&
        e.newValue &&
        e.newValue in TRANSLATIONS
      ) {
        setLanguageState(e.newValue as Language);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const t = TRANSLATIONS[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useLanguage()
 * Returns { language, setLanguage, t } where t is the full translation object
 * for the currently active language.
 *
 * Usage:
 *   const { t, language, setLanguage } = useLanguage();
 *   <h1>{t.hero.headline1}</h1>
 */
export function useLanguage(): LanguageContextType {
  return useContext(LanguageContext);
}

export const useTranslation = useLanguage;


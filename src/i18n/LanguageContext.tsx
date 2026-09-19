import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  WEDDING_DATE_DISPLAY,
  WEDDING_DATE_DISPLAY_ES,
  RSVP_DEADLINE,
  RSVP_DEADLINE_ES,
} from '@/constants';

export type Lang = 'en' | 'es';

/** A piece of text written in both languages, e.g. { en: 'Hello', es: 'Hola' } */
export type Localized<T = string> = Record<Lang, T>;

/** Shorthand for writing a Localized value: L('Hello', 'Hola') */
export function L<T = string>(en: T, es: T): Localized<T> {
  return { en, es };
}

const STORAGE_KEY = 'wedding_lang';

/**
 * Which language to start in:
 *  1. the language the visitor picked last time (saved on their device), otherwise
 *  2. Spanish if their phone/browser is set to Spanish, otherwise English.
 */
function detectInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'es') return stored;
  } catch {
    /* storage unavailable — fall through */
  }
  if (typeof navigator !== 'undefined') {
    const preferred = navigator.languages?.[0] ?? navigator.language ?? '';
    if (preferred.toLowerCase().startsWith('es')) return 'es';
  }
  return 'en';
}

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  /** Pick the English or Spanish version of a piece of text (or JSX). */
  t: <T>(en: T, es: T) => T;
  /** Locale code for formatting dates and numbers. */
  locale: string;
  /** Wedding date and RSVP deadline, formatted for the current language. */
  weddingDate: string;
  rsvpDeadline: string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'es' : 'en');
  }, [lang, setLang]);

  // Tell the browser (and screen readers) which language the page is in.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      toggleLang,
      t: <T,>(en: T, es: T) => (lang === 'es' ? es : en),
      locale: lang === 'es' ? 'es-MX' : 'en-US',
      weddingDate: lang === 'es' ? WEDDING_DATE_DISPLAY_ES : WEDDING_DATE_DISPLAY,
      rsvpDeadline: lang === 'es' ? RSVP_DEADLINE_ES : RSVP_DEADLINE,
    }),
    [lang, setLang, toggleLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

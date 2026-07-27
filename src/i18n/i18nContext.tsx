import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { en } from './translations/en';
import { ar } from './translations/ar';
import type { Translations } from './translations/en';

type Locale = 'en' | 'ar';

interface I18nContextValue {
  t: Translations;
  locale: Locale;
  toggleLocale: () => void;
}

const translations: Record<Locale, Translations> = { en, ar };

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const stored = window.localStorage.getItem('locale');
    return stored === 'ar' ? 'ar' : 'en';
  });

  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    window.localStorage.setItem('locale', locale);
  }, [locale]);

  const toggleLocale = () => setLocale((prev) => (prev === 'en' ? 'ar' : 'en'));

  return (
    <I18nContext.Provider value={{ t: translations[locale], locale, toggleLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

import { DEFAULT_LOCALE, isLocale, LOCALE_STORAGE_KEY, type Locale } from "./locales";

export function rememberLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {}
}

export function preferredLocale(): Locale {
  try {
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {}
  const fromBrowser = navigator.languages.map((tag) => tag.slice(0, 2).toLowerCase()).find(isLocale);
  return fromBrowser ?? DEFAULT_LOCALE;
}

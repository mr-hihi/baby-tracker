"use client";

import { createContext, useContext, type ReactNode } from "react";
import { getDictionary } from "./dictionaries";
import { DEFAULT_LOCALE, type Locale } from "./locales";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

export function useLocale() {
  const locale = useContext(LocaleContext);
  return { locale, dict: getDictionary(locale) };
}

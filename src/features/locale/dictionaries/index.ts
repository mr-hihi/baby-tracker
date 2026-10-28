import type { Locale } from "../locales";
import { en } from "./en";
import { vi, type Dictionary } from "./vi";

const DICTIONARIES: Record<Locale, Dictionary> = { vi, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

export type { Dictionary, PluralForms } from "./vi";

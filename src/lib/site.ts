import type { GrowthStep } from "@/features/growth/steps";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/features/locale/locales";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4071").replace(/\/+$/, "");
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const OG_IMAGE_PATH = "/og-image.png";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}

export function localePath(locale: Locale, path = ""): string {
  return `/${locale}/${path}`;
}

export function languageAlternates(path = ""): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) languages[locale] = absoluteUrl(localePath(locale, path));
  languages["x-default"] = absoluteUrl(path ? localePath(DEFAULT_LOCALE, path) : "/");
  return languages;
}

export function weekPath(week: number): string {
  return `week/${week}/`;
}

export function monthPath(month: number): string {
  return `month/${month}/`;
}

export function agePath(age: number): string {
  return `age/${age}/`;
}

export function stepPath(step: GrowthStep): string {
  if (step.kind === "week") return weekPath(step.value);
  if (step.kind === "month") return monthPath(step.value);
  return agePath(step.value);
}

export const VACCINES_PATH = "vaccines/";

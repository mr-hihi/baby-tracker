export const LOCALES = ["vi", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string | null | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

export const DEFAULT_LOCALE: Locale = isLocale(process.env.NEXT_PUBLIC_DEFAULT_LOCALE)
  ? process.env.NEXT_PUBLIC_DEFAULT_LOCALE
  : "vi";

export const LOCALE_STORAGE_KEY = "baby-tracker:locale";

export const LANGUAGE_TAGS: Record<Locale, string> = { vi: "vi-VN", en: "en-US" };

export function switchLocaleInPath(pathname: string, target: Locale): string {
  const [, , ...rest] = pathname.split("/");
  return `/${target}/${rest.join("/")}`.replace(/\/+$/, "/");
}

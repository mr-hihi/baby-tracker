import type { BeatRange } from "@/features/growth/pregnancy-weeks";
import type { CalendarSpan, IsoDate } from "@/lib/date";
import type { Dictionary, PluralForms } from "./dictionaries";
import { LANGUAGE_TAGS, type Locale } from "./locales";

export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (placeholder, key: string) =>
    key in values ? String(values[key]) : placeholder,
  );
}

export function formatNumber(value: number, locale: Locale, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat(LANGUAGE_TAGS[locale], { maximumFractionDigits }).format(value);
}

export function count(forms: PluralForms, n: number, locale: Locale): string {
  const form = new Intl.PluralRules(LANGUAGE_TAGS[locale]).select(n) === "one" ? forms.one : forms.other;
  return fill(form, { n: formatNumber(n, locale) });
}

export function formatLength(cm: number, locale: Locale): string {
  if (cm < 1) return `${formatNumber(cm * 10, locale, 1)} mm`;
  return `${formatNumber(cm, locale, 1)} cm`;
}

export function formatWeight(grams: number, locale: Locale, dict: Dictionary): string {
  if (grams < 1) return dict.growth.lessThanOneGram;
  if (grams < 1000) return `${formatNumber(grams, locale)} g`;
  const kg = grams / 1000;
  return `${formatNumber(kg, locale, kg < 10 ? 3 : 1)} kg`;
}

export function formatBeatRange([min, max]: BeatRange, dict: Dictionary): string {
  return fill(dict.growth.beatsPerMinute, { min, max });
}

export function formatIsoDate(iso: IsoDate, locale: Locale): string {
  const [year, month, day] = iso.split("-").map(Number);
  const style: Intl.DateTimeFormatOptions =
    locale === "vi"
      ? { day: "2-digit", month: "2-digit", year: "numeric" }
      : { day: "numeric", month: "short", year: "numeric" };
  return new Intl.DateTimeFormat(LANGUAGE_TAGS[locale], { ...style, timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, day)),
  );
}

export function formatPregnancyAge(weeks: number, days: number, locale: Locale, dict: Dictionary): string {
  const parts: string[] = [];
  if (weeks > 0) parts.push(count(dict.units.week, weeks, locale));
  if (days > 0 || weeks === 0) parts.push(count(dict.units.day, days, locale));
  return parts.join(" ");
}

export function formatChildAge(age: CalendarSpan, locale: Locale, dict: Dictionary): string {
  const { units } = dict;
  if (age.years > 0) {
    const years = count(units.year, age.years, locale);
    return age.months > 0 ? `${years} ${count(units.month, age.months, locale)}` : years;
  }
  if (age.months > 0) {
    const months = count(units.month, age.months, locale);
    return age.days > 0 ? `${months} ${count(units.day, age.days, locale)}` : months;
  }
  return count(units.day, age.days, locale);
}

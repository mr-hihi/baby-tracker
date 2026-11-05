import type { BeatRange } from "@/features/growth/pregnancy-weeks";
import type { GrowthStats } from "@/features/growth/stats";
import type { Range } from "@/features/routine/routine-stages";
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

function pluralForm(forms: PluralForms, n: number, locale: Locale): string {
  return new Intl.PluralRules(LANGUAGE_TAGS[locale]).select(n) === "one" ? forms.one : forms.other;
}

export function count(forms: PluralForms, n: number, locale: Locale): string {
  return fill(pluralForm(forms, n, locale), { n: formatNumber(n, locale) });
}

export function formatRange([min, max]: Range, locale: Locale, maximumFractionDigits = 1): string {
  const low = formatNumber(min, locale, maximumFractionDigits);
  return min === max ? low : `${low}–${formatNumber(max, locale, maximumFractionDigits)}`;
}

export function countRange(forms: PluralForms, range: Range, locale: Locale): string {
  const [min, max] = range;
  const form = min === max ? pluralForm(forms, min, locale) : forms.other;
  return fill(form, { n: formatRange(range, locale) });
}

const CM_FRACTION_DIGITS = 1;
const KG_DIGITS_TO_THE_GRAM = 3;

function kgFractionDigits(grams: number): number {
  return grams < 10_000 ? KG_DIGITS_TO_THE_GRAM : 1;
}

function roundHalfUp(value: number, fractionDigits: number): number {
  const scale = 10 ** fractionDigits;
  // @why toFixed strips binary noise first, so an average such as 126.95 (stored as 126.9499…) rounds up.
  return Math.round(Number((value * scale).toFixed(6))) / scale;
}

export function roundLength(cm: number): number {
  return roundHalfUp(cm, CM_FRACTION_DIGITS);
}

export function roundWeight(grams: number): number {
  const stepG = 10 ** (KG_DIGITS_TO_THE_GRAM - kgFractionDigits(grams));
  return roundHalfUp(grams / stepG, 0) * stepG;
}

function formatChange(value: number, locale: Locale, maximumFractionDigits: number): string {
  const options: Intl.NumberFormatOptions = { maximumFractionDigits, signDisplay: "exceptZero" };
  return new Intl.NumberFormat(LANGUAGE_TAGS[locale], options).format(value);
}

export function formatLength(cm: number, locale: Locale): string {
  if (cm < 1) return `${formatNumber(cm * 10, locale, 1)} mm`;
  return `${formatNumber(cm, locale, CM_FRACTION_DIGITS)} cm`;
}

export function formatWeight(grams: number, locale: Locale, dict: Dictionary): string {
  if (grams < 1) return dict.growth.lessThanOneGram;
  if (grams < 1000) return `${formatNumber(grams, locale)} g`;
  return `${formatNumber(grams / 1000, locale, kgFractionDigits(grams))} kg`;
}

export function formatSizeStat({ sizeCm, sizeDeltaCm }: GrowthStats, locale: Locale, dict: Dictionary): string {
  if (sizeCm === undefined) return dict.growth.notYet;
  const value = formatLength(sizeCm, locale);
  if (sizeDeltaCm === undefined) return value;
  const delta = formatChange(sizeDeltaCm, locale, CM_FRACTION_DIGITS);
  return fill(dict.growth.valueWithDelta, { value, delta });
}

export function formatWeightStat({ weightG, weightDeltaG }: GrowthStats, locale: Locale, dict: Dictionary): string {
  if (weightG === undefined) return dict.growth.notYet;
  const value = formatWeight(weightG, locale, dict);
  if (weightDeltaG === undefined) return value;
  const delta = formatChange(weightDeltaG / 1000, locale, KG_DIGITS_TO_THE_GRAM);
  return fill(dict.growth.valueWithDelta, { value, delta });
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
  return `${count(dict.units.week, weeks, locale)} ${count(dict.units.day, days, locale)}`;
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

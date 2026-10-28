import type { GrowthProgress } from "@/features/growth/timeline";
import type { Dictionary } from "@/features/locale/dictionaries";
import { fill, formatChildAge, formatIsoDate, formatNumber, formatPregnancyAge } from "@/features/locale/format";
import type { Locale } from "@/features/locale/locales";

export type ProgressDescription = { headline: string; details: string[] };

export function describeProgress(progress: GrowthProgress, locale: Locale, dict: Dictionary): ProgressDescription {
  const { dashboard } = dict;
  if (progress.stage === "pregnancy") {
    return {
      headline: formatPregnancyAge(progress.weeks, progress.days, locale, dict),
      details: [
        `${fill(dashboard.dueDate, { date: formatIsoDate(progress.dueDate, locale) })} · ${fill(dashboard.daysUntilDue, { days: formatNumber(progress.daysUntilDue, locale) })}`,
      ],
    };
  }
  return {
    headline: formatChildAge(progress.age, locale, dict),
    details: [
      fill(dashboard.daysSinceBirth, { days: formatNumber(progress.daysSinceBirth, locale) }),
      fill(dashboard.birthDate, { date: formatIsoDate(progress.birthDate, locale) }),
    ],
  };
}

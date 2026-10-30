import { addDays, addMonths, calendarSpan, daysBetween, type CalendarSpan, type IsoDate } from "@/lib/date";
import { ageStep, MAX_AGE, MAX_MONTH, monthsAfterBirth, monthStep, weekStep, type GrowthStep } from "./steps";

export const PREGNANCY_DAYS = 280;

export type GrowthProgress =
  | {
      stage: "pregnancy";
      weeks: number;
      days: number;
      dueDate: IsoDate;
      daysUntilDue: number;
    }
  | {
      stage: "born";
      birthDate: IsoDate;
      age: CalendarSpan;
      daysSinceBirth: number;
    };

export function estimatedBirthDate(lastPeriodDate: IsoDate): IsoDate {
  return addDays(lastPeriodDate, PREGNANCY_DAYS);
}

export function growthProgress(lastPeriodDate: IsoDate, today: IsoDate): GrowthProgress {
  const elapsed = Math.max(0, daysBetween(lastPeriodDate, today));
  const birthDate = estimatedBirthDate(lastPeriodDate);
  if (elapsed < PREGNANCY_DAYS) {
    return {
      stage: "pregnancy",
      weeks: Math.floor(elapsed / 7),
      days: elapsed % 7,
      dueDate: birthDate,
      daysUntilDue: PREGNANCY_DAYS - elapsed,
    };
  }
  return {
    stage: "born",
    birthDate,
    age: calendarSpan(birthDate, today),
    daysSinceBirth: elapsed - PREGNANCY_DAYS,
  };
}

export function stepForProgress(progress: GrowthProgress): GrowthStep {
  if (progress.stage === "pregnancy") return { kind: "week", value: progress.weeks + 1 };
  return { kind: "age", value: Math.min(progress.age.years, MAX_AGE) };
}

export function currentPointForProgress(progress: GrowthProgress): GrowthStep {
  if (progress.stage === "pregnancy") return weekStep(progress.weeks + 1);
  const months = progress.age.years * 12 + progress.age.months;
  if (months <= MAX_MONTH) return monthStep(months);
  return ageStep(Math.min(progress.age.years, MAX_AGE));
}

export function stepStartDate(step: GrowthStep, lastPeriodDate: IsoDate): IsoDate {
  if (step.kind === "week") return addDays(lastPeriodDate, 7 * (step.value - 1));
  return addMonths(estimatedBirthDate(lastPeriodDate), monthsAfterBirth(step));
}

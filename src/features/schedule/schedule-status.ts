import { compareSteps, type GrowthStep, type StepKind } from "@/features/growth/steps";
import { stepStartDate } from "@/features/growth/timeline";
import type { IsoDate } from "@/lib/date";

export type ScheduledItem = { id: string; stepKind: StepKind; from: number; to: number };
export type ScheduleRecord = Partial<Record<string, IsoDate>>;
export type ScheduleStatus = "done" | "upcoming" | "due" | "overdue";

function windowStart(item: ScheduledItem): GrowthStep {
  return { kind: item.stepKind, value: item.from };
}

function windowEnd(item: ScheduledItem): GrowthStep {
  return { kind: item.stepKind, value: item.to };
}

export function scheduleStatus(item: ScheduledItem, point: GrowthStep, record: ScheduleRecord): ScheduleStatus {
  if (record[item.id]) return "done";
  if (compareSteps(point, windowStart(item)) < 0) return "upcoming";
  if (compareSteps(point, windowEnd(item)) <= 0) return "due";
  return "overdue";
}

export function scheduleStartDate(item: ScheduledItem, lastPeriodDate: IsoDate): IsoDate {
  return stepStartDate(windowStart(item), lastPeriodDate);
}

export function itemsAtStep<T extends ScheduledItem>(items: readonly T[], step: GrowthStep): T[] {
  return items.filter(
    (item) => compareSteps(windowStart(item), step) <= 0 && compareSteps(step, windowEnd(item)) <= 0,
  );
}

export function overdueItemsBeforeStep<T extends ScheduledItem>(
  items: readonly T[],
  step: GrowthStep,
  point: GrowthStep,
  record: ScheduleRecord,
): T[] {
  return items.filter(
    (item) => compareSteps(windowEnd(item), step) < 0 && scheduleStatus(item, point, record) === "overdue",
  );
}

export function itemsNeedingAction<T extends ScheduledItem>(
  items: readonly T[],
  point: GrowthStep,
  record: ScheduleRecord,
): T[] {
  const itemsWith = (status: ScheduleStatus) => items.filter((item) => scheduleStatus(item, point, record) === status);
  return [...itemsWith("due"), ...itemsWith("overdue")];
}

export function nextUpcomingItem<T extends ScheduledItem>(
  items: readonly T[],
  point: GrowthStep,
  record: ScheduleRecord,
): T | undefined {
  return items.find((item) => scheduleStatus(item, point, record) === "upcoming");
}

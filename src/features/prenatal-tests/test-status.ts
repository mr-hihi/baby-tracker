import { weekStep, type GrowthStep } from "@/features/growth/steps";
import {
  itemsAtStep,
  itemsNeedingAction,
  nextUpcomingItem,
  overdueItemsBeforeStep,
} from "@/features/schedule/schedule-status";
import { PRENATAL_TESTS, type PrenatalTest, type PrenatalTestRecord } from "./prenatal-tests";

export function testsAtWeek(week: number): PrenatalTest[] {
  return itemsAtStep(PRENATAL_TESTS, weekStep(week));
}

export function overdueTestsBeforeWeek(
  week: number,
  point: GrowthStep,
  prenatalTests: PrenatalTestRecord,
): PrenatalTest[] {
  return overdueItemsBeforeStep(PRENATAL_TESTS, weekStep(week), point, prenatalTests);
}

export function testsNeedingAction(point: GrowthStep, prenatalTests: PrenatalTestRecord): PrenatalTest[] {
  return itemsNeedingAction(PRENATAL_TESTS, point, prenatalTests);
}

export function nextUpcomingTest(point: GrowthStep, prenatalTests: PrenatalTestRecord): PrenatalTest | undefined {
  return nextUpcomingItem(PRENATAL_TESTS, point, prenatalTests);
}

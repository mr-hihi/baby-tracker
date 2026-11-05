import { describe, expect, it } from "vitest";
import { ageStep, MAX_AGE, MAX_MONTH, monthStep, PREGNANCY_WEEKS, weekStep, type GrowthStep } from "@/features/growth/steps";
import { FEEDING_STAGES, routineForStep, SLEEP_STAGES, type FeedingStage, type Range, type SleepStage } from "./routine-stages";

const STAGE_LIMITS = { month: [0, MAX_MONTH], age: [2, MAX_AGE] } as const;

type Stage = FeedingStage | SleepStage;

const ALL_STAGES: readonly Stage[] = [...FEEDING_STAGES, ...SLEEP_STAGES];

function stepsBetween(from: number, to: number, stepFor: (value: number) => GrowthStep): GrowthStep[] {
  return Array.from({ length: to - from + 1 }, (_, i) => stepFor(from + i));
}

const COVERED_STEPS = [...stepsBetween(0, MAX_MONTH, monthStep), ...stepsBetween(2, MAX_AGE, ageStep)];
const UNCOVERED_STEPS = [...stepsBetween(1, PREGNANCY_WEEKS, weekStep), ageStep(0), ageStep(1)];

function stagesCovering(stages: readonly Stage[], step: GrowthStep): string[] {
  return stages
    .filter((stage) => stage.stepKind === step.kind && stage.from <= step.value && step.value <= stage.to)
    .map((stage) => stage.id);
}

const COVERAGE = COVERED_STEPS.map((step) => ({
  step: `${step.kind} ${step.value}`,
  feeding: stagesCovering(FEEDING_STAGES, step).length,
  sleep: stagesCovering(SLEEP_STAGES, step).length,
}));

function rangesOf(stage: Stage): Range[] {
  return Object.values(stage).filter((value): value is Range => Array.isArray(value));
}

const RANGES = ALL_STAGES.flatMap((stage) =>
  rangesOf(stage).map(([min, max]) => ({ id: stage.id, min, max, isOrdered: 0 < min && min <= max })),
);

const WINDOWS = ALL_STAGES.map((stage) => {
  const [lowest, highest] = STAGE_LIMITS[stage.stepKind];
  return { id: stage.id, isInside: lowest <= stage.from && stage.from <= stage.to && stage.to <= highest };
});

const MEAL_STAGES = FEEDING_STAGES.filter((stage) => !("mlPerFeed" in stage)).map((stage) => ({
  id: stage.id,
  stepKind: stage.stepKind,
  hasMainMeals: "mainMeals" in stage,
  hasSnacks: "snacks" in stage,
}));

const LAST_MILK_MONTH = 11;

const MILK_STAGES = FEEDING_STAGES.filter((stage) => "mlPerFeed" in stage).map((stage) => ({
  id: stage.id,
  isFirstYearMonth: stage.stepKind === "month" && stage.to <= LAST_MILK_MONTH,
}));

const SLEEP_NAPS = SLEEP_STAGES.map((stage) => ({
  id: stage.id,
  hasNaps: "naps" in stage,
  hasNapsSource: "napsSource" in stage,
}));

describe("routine content", () => {
  it("has unique ids across feeding and sleep", () => {
    expect(new Set(ALL_STAGES.map((stage) => stage.id)).size).toBe(ALL_STAGES.length);
  });

  it.each(WINDOWS)("keeps $id inside its step kind", ({ isInside }) => {
    expect(isInside).toBe(true);
  });

  it.each(COVERAGE)("gives $step exactly one feeding and one sleep stage", ({ feeding, sleep }) => {
    expect([feeding, sleep]).toEqual([1, 1]);
  });

  it.each(RANGES)("orders every range of $id above zero ($min–$max)", ({ isOrdered }) => {
    expect(isOrdered).toBe(true);
  });

  it.each(MILK_STAGES)("keeps the milk stage $id inside months 0–11", ({ isFirstYearMonth }) => {
    expect(isFirstYearMonth).toBe(true);
  });

  it.each(MEAL_STAGES)("lists main meals for the meal stage $id only on age pages", ({ stepKind, hasMainMeals }) => {
    expect(hasMainMeals).toBe(stepKind === "age");
  });

  it.each(MEAL_STAGES)("lists snacks for the meal stage $id only on age pages", ({ stepKind, hasSnacks }) => {
    expect(hasSnacks).toBe(stepKind === "age");
  });

  it.each(SLEEP_NAPS)("names a source for the naps of $id exactly when it has naps", ({ hasNaps, hasNapsSource }) => {
    expect(hasNapsSource).toBe(hasNaps);
  });
});

describe("routineForStep", () => {
  it.each(UNCOVERED_STEPS)("has nothing for $kind $value", (step) => {
    expect(routineForStep(step)).toEqual({ feeding: undefined, sleep: undefined });
  });

  it("gives month 0 the newborn milk and sleep stages", () => {
    const { feeding, sleep } = routineForStep(monthStep(0));
    expect([feeding?.id, sleep?.id]).toEqual(["milk-newborn", "sleep-newborn"]);
  });

  it("gives month 12 the family meals and the one-or-two-naps stage", () => {
    const { feeding, sleep } = routineForStep(monthStep(12));
    expect([feeding?.id, sleep?.id]).toEqual(["meals-family", "sleep-one-two-naps"]);
  });

  it("gives age 13 the older meals and the teen sleep stage", () => {
    const { feeding, sleep } = routineForStep(ageStep(13));
    expect([feeding?.id, sleep?.id]).toEqual(["meals-older", "sleep-teen"]);
  });
});

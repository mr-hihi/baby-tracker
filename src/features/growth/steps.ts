export const PREGNANCY_WEEKS = 40;
export const MAX_MONTH = 24;
export const MAX_AGE = 18;

export type GrowthStep =
  | { kind: "week"; value: number }
  | { kind: "month"; value: number }
  | { kind: "age"; value: number };

export type StepKind = GrowthStep["kind"];

type StepAfterBirth = Exclude<GrowthStep, { kind: "week" }>;

const WEEKS: GrowthStep[] = Array.from({ length: PREGNANCY_WEEKS }, (_, i) => ({ kind: "week", value: i + 1 }));
const MONTHS: GrowthStep[] = Array.from({ length: MAX_MONTH + 1 }, (_, i) => ({ kind: "month", value: i }));
const AGES: GrowthStep[] = Array.from({ length: MAX_AGE + 1 }, (_, i) => ({ kind: "age", value: i }));

const STEPS_BY_KIND: Record<StepKind, GrowthStep[]> = { week: WEEKS, month: MONTHS, age: AGES };

export const GROWTH_STEPS: readonly GrowthStep[] = [...WEEKS, ...AGES];

export function stepIndex(step: GrowthStep): number {
  return step.kind === "week" ? step.value - 1 : PREGNANCY_WEEKS + step.value;
}

export function isSameStep(a: GrowthStep, b: GrowthStep): boolean {
  return a.kind === b.kind && a.value === b.value;
}

export function previousStep(step: GrowthStep): GrowthStep | undefined {
  if (step.kind === "month") return MONTHS[step.value - 1];
  return GROWTH_STEPS[stepIndex(step) - 1];
}

export function nextStep(step: GrowthStep): GrowthStep | undefined {
  if (step.kind === "month") return MONTHS[step.value + 1];
  return GROWTH_STEPS[stepIndex(step) + 1];
}

export function stepWindow(step: GrowthStep, size = 5): GrowthStep[] {
  const sameKind = STEPS_BY_KIND[step.kind];
  const position = sameKind.findIndex((candidate) => candidate.value === step.value);
  const start = Math.max(0, Math.min(position - Math.floor(size / 2), sameKind.length - size));
  return sameKind.slice(start, start + size);
}

export function monthsAfterBirth(step: StepAfterBirth): number {
  return step.kind === "month" ? step.value : step.value * 12;
}

export function compareSteps(a: GrowthStep, b: GrowthStep): number {
  if (a.kind === "week" && b.kind === "week") return a.value - b.value;
  if (a.kind === "week") return -1;
  if (b.kind === "week") return 1;
  return monthsAfterBirth(a) - monthsAfterBirth(b);
}

export function ageAtMonth(month: number): number {
  return Math.floor(month / 12);
}

export function monthsInAge(age: number): number[] {
  return MONTHS.map((step) => step.value).filter((month) => ageAtMonth(Math.min(month, MAX_MONTH - 1)) === age);
}

export function weekStep(week: number): GrowthStep {
  return { kind: "week", value: week };
}

export function monthStep(month: number): GrowthStep {
  return { kind: "month", value: month };
}

export function ageStep(age: number): GrowthStep {
  return { kind: "age", value: age };
}

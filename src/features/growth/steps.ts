export const PREGNANCY_WEEKS = 40;
export const MAX_AGE = 18;

export type GrowthStep = { kind: "week"; value: number } | { kind: "age"; value: number };

const WEEKS: GrowthStep[] = Array.from({ length: PREGNANCY_WEEKS }, (_, i) => ({ kind: "week", value: i + 1 }));
const AGES: GrowthStep[] = Array.from({ length: MAX_AGE + 1 }, (_, i) => ({ kind: "age", value: i }));

export const GROWTH_STEPS: readonly GrowthStep[] = [...WEEKS, ...AGES];

export function stepIndex(step: GrowthStep): number {
  return step.kind === "week" ? step.value - 1 : PREGNANCY_WEEKS + step.value;
}

export function isSameStep(a: GrowthStep, b: GrowthStep): boolean {
  return a.kind === b.kind && a.value === b.value;
}

export function previousStep(step: GrowthStep): GrowthStep | undefined {
  return GROWTH_STEPS[stepIndex(step) - 1];
}

export function nextStep(step: GrowthStep): GrowthStep | undefined {
  return GROWTH_STEPS[stepIndex(step) + 1];
}

export function stepWindow(step: GrowthStep, size = 5): GrowthStep[] {
  const sameKind = step.kind === "week" ? WEEKS : AGES;
  const position = sameKind.findIndex((candidate) => candidate.value === step.value);
  const start = Math.max(0, Math.min(position - Math.floor(size / 2), sameKind.length - size));
  return sameKind.slice(start, start + size);
}

export function weekStep(week: number): GrowthStep {
  return { kind: "week", value: week };
}

export function ageStep(age: number): GrowthStep {
  return { kind: "age", value: age };
}

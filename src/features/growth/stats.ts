import { roundLength, roundWeight } from "@/features/locale/format";
import {
  bodySize,
  restingHeartRate,
  SOURCE_FAMILIES,
  yearReference,
  type BodyReference,
  type BodySize,
  type Gender,
  type GrowthSource,
  type SizeMethod,
} from "./childhood-years";
import { monthBodySize, monthReference } from "./infant-months";
import { weekFacts, type BeatRange, type Fruit, type LengthMethod } from "./pregnancy-weeks";
import { ageAtMonth, type GrowthStep } from "./steps";

export type DeltaBreak = "method" | "source";

export type GrowthStats = {
  measure: LengthMethod | SizeMethod;
  sizeCm?: number;
  weightG?: number;
  sizeDeltaCm?: number;
  weightDeltaG?: number;
  sizeDeltaBreak?: DeltaBreak;
  weightDeltaBreak?: DeltaBreak;
  heartRate?: BeatRange;
  fruit?: Fruit;
  estimated?: boolean;
};

type BodyFigures = { reference: BodyReference; sizeCm: number; weightG: number };

type BodyChange = Pick<GrowthStats, "sizeDeltaCm" | "weightDeltaG" | "sizeDeltaBreak" | "weightDeltaBreak">;

function roundBodyFigures(reference: BodyReference, size: BodySize): BodyFigures {
  return { reference, sizeCm: roundLength(size.heightCm), weightG: roundWeight(size.weightKg * 1000) };
}

function monthFigures(month: number, gender?: Gender): BodyFigures {
  return roundBodyFigures(monthReference(month), monthBodySize(month, gender));
}

function yearFigures(age: number, gender?: Gender): BodyFigures {
  return roundBodyFigures(yearReference(age), bodySize(age, gender));
}

function sourceBreak(current: GrowthSource, previous: GrowthSource): DeltaBreak | undefined {
  return SOURCE_FAMILIES[current] === SOURCE_FAMILIES[previous] ? undefined : "source";
}

function sizeBreak(current: BodyReference, previous: BodyReference): DeltaBreak | undefined {
  if (current.sizeMethod !== previous.sizeMethod) return "method";
  return sourceBreak(current.sizeSource, previous.sizeSource);
}

function calculateBodyChange(current: BodyFigures, previous: BodyFigures): BodyChange {
  const sizeDeltaBreak = sizeBreak(current.reference, previous.reference);
  const weightDeltaBreak = sourceBreak(current.reference.weightSource, previous.reference.weightSource);
  return {
    ...(sizeDeltaBreak ? { sizeDeltaBreak } : { sizeDeltaCm: roundLength(current.sizeCm - previous.sizeCm) }),
    ...(weightDeltaBreak ? { weightDeltaBreak } : { weightDeltaG: current.weightG - previous.weightG }),
  };
}

function bodyStats(age: number, current: BodyFigures, previous?: BodyFigures): GrowthStats {
  const stats: GrowthStats = {
    measure: current.reference.sizeMethod,
    sizeCm: current.sizeCm,
    weightG: current.weightG,
    heartRate: restingHeartRate(age),
  };
  return previous ? { ...stats, ...calculateBodyChange(current, previous) } : stats;
}

export function growthStats(step: GrowthStep, gender?: Gender): GrowthStats {
  if (step.kind === "week") {
    const facts = weekFacts(step.value);
    return {
      measure: facts.lengthMethod,
      sizeCm: facts.lengthCm,
      weightG: facts.weightG,
      heartRate: facts.heartRate,
      fruit: facts.fruit,
      estimated: facts.estimated,
    };
  }
  const { kind, value } = step;
  if (kind === "month") {
    const previous = value > 0 ? monthFigures(value - 1, gender) : undefined;
    return bodyStats(ageAtMonth(value), monthFigures(value, gender), previous);
  }
  const previous = value > 0 ? yearFigures(value - 1, gender) : undefined;
  return bodyStats(value, yearFigures(value, gender), previous);
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function babyImagePath(step: GrowthStep, gender?: Gender): string {
  if (step.kind === "week") return `/assets/baby/week-${pad(step.value)}.svg`;
  const age = step.kind === "month" ? ageAtMonth(step.value) : step.value;
  const folder = gender ? `${gender}/` : "";
  return `/assets/baby/${folder}age-${pad(age)}.svg`;
}

export function fruitImagePath(fruit: Fruit): string {
  return `/assets/size/${fruit}.svg`;
}

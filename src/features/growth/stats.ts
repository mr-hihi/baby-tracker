import { bodySize, restingHeartRate, type BodySize, type Gender } from "./childhood-years";
import { monthBodySize } from "./infant-months";
import { weekFacts, type BeatRange, type Fruit, type LengthMethod } from "./pregnancy-weeks";
import { ageAtMonth, MAX_MONTH, type GrowthStep } from "./steps";

export type GrowthStats = {
  measure: LengthMethod | "length" | "height";
  sizeCm?: number;
  weightG?: number;
  heartRate?: BeatRange;
  fruit?: Fruit;
  estimated?: boolean;
};

function bodyStats(measure: GrowthStats["measure"], size: BodySize, age: number): GrowthStats {
  return {
    measure,
    sizeCm: size.heightCm,
    weightG: Math.round(size.weightKg * 1000),
    heartRate: restingHeartRate(age),
  };
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
  if (step.kind === "month") {
    const measure = step.value < MAX_MONTH ? "length" : "height";
    return bodyStats(measure, monthBodySize(step.value, gender), ageAtMonth(step.value));
  }
  return bodyStats("height", bodySize(step.value, gender), step.value);
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

import { bodySize, restingHeartRate, type Gender } from "./childhood-years";
import { weekFacts, type BeatRange, type Fruit } from "./pregnancy-weeks";
import type { GrowthStep } from "./steps";

export type GrowthStats = {
  measure: "length" | "height";
  sizeCm?: number;
  weightG?: number;
  heartRate?: BeatRange;
  fruit?: Fruit;
};

export function growthStats(step: GrowthStep, gender?: Gender): GrowthStats {
  if (step.kind === "week") {
    const facts = weekFacts(step.value);
    return {
      measure: "length",
      sizeCm: facts.lengthCm,
      weightG: facts.weightG,
      heartRate: facts.heartRate,
      fruit: facts.fruit,
    };
  }
  const size = bodySize(step.value, gender);
  return {
    measure: "height",
    sizeCm: size.heightCm,
    weightG: Math.round(size.weightKg * 1000),
    heartRate: restingHeartRate(step.value),
  };
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function babyImagePath(step: GrowthStep, gender?: Gender): string {
  if (step.kind === "week") return `/assets/baby/week-${pad(step.value)}.svg`;
  const folder = gender ? `${gender}/` : "";
  return `/assets/baby/${folder}age-${pad(step.value)}.svg`;
}

export function fruitImagePath(fruit: Fruit): string {
  return `/assets/size/${fruit}.svg`;
}

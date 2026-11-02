export type BeatRange = readonly [min: number, max: number];

export const FRUITS = [
  "poppy-seed",
  "sesame-seed",
  "lentil",
  "blueberry",
  "raspberry",
  "cherry",
  "strawberry",
  "fig",
  "lime",
  "peach",
  "lemon",
  "apple",
  "avocado",
  "pear",
  "bell-pepper",
  "mango",
  "banana",
  "carrot",
  "papaya",
  "grapefruit",
  "corn",
  "cauliflower",
  "lettuce",
  "cabbage",
  "pomelo",
  "butternut-squash",
  "eggplant",
  "coconut",
  "jicama",
  "pineapple",
  "cantaloupe",
  "honeydew",
  "winter-melon",
  "leek",
  "mini-watermelon",
  "pumpkin",
] as const;

export type Fruit = (typeof FRUITS)[number];

export type LengthMethod = "crown-rump" | "crown-heel";

export type WeekFacts = {
  lengthMethod: LengthMethod;
  fruit?: Fruit;
  lengthCm?: number;
  weightG?: number;
  estimated?: boolean;
  heartRate?: BeatRange;
};

type FetalSize = { lengthCm: number; weightG: number };

const FETAL_HEART: BeatRange = [120, 160];
const FETAL_HEART_FROM_WEEK = 13;
const FIRST_SIZED_WEEKS = 4;
const CROWN_HEEL_FROM_WEEKS = 20;

const EARLY_HEART: Record<number, BeatRange> = {
  6: [100, 120],
  7: [120, 160],
  8: [140, 170],
  9: [150, 175],
  10: [155, 180],
  11: [150, 175],
  12: [140, 170],
};

const ESTIMATED_SIZES: Record<number, FetalSize> = {
  4: { lengthCm: 0.1, weightG: 0.1 },
  5: { lengthCm: 0.2, weightG: 0.1 },
  6: { lengthCm: 0.5, weightG: 0.2 },
  7: { lengthCm: 1.0, weightG: 0.5 },
};

const SIZES: Record<number, FetalSize> = {
  8: { lengthCm: 1.6, weightG: 1 },
  9: { lengthCm: 2.3, weightG: 2 },
  10: { lengthCm: 3.1, weightG: 4 },
  11: { lengthCm: 4.1, weightG: 7 },
  12: { lengthCm: 5.4, weightG: 14 },
  13: { lengthCm: 7.4, weightG: 23 },
  14: { lengthCm: 8.7, weightG: 43 },
  15: { lengthCm: 10.1, weightG: 70 },
  16: { lengthCm: 11.6, weightG: 100 },
  17: { lengthCm: 13.0, weightG: 140 },
  18: { lengthCm: 14.2, weightG: 190 },
  19: { lengthCm: 15.3, weightG: 240 },
  20: { lengthCm: 25.7, weightG: 330 },
  21: { lengthCm: 27.4, weightG: 400 },
  22: { lengthCm: 29.0, weightG: 476 },
  23: { lengthCm: 30.6, weightG: 565 },
  24: { lengthCm: 32.2, weightG: 665 },
  25: { lengthCm: 33.7, weightG: 756 },
  26: { lengthCm: 35.1, weightG: 900 },
  27: { lengthCm: 36.6, weightG: 1000 },
  28: { lengthCm: 37.6, weightG: 1100 },
  29: { lengthCm: 39.3, weightG: 1239 },
  30: { lengthCm: 40.5, weightG: 1396 },
  31: { lengthCm: 41.8, weightG: 1568 },
  32: { lengthCm: 43.0, weightG: 1755 },
  33: { lengthCm: 44.1, weightG: 2000 },
  34: { lengthCm: 45.3, weightG: 2200 },
  35: { lengthCm: 46.3, weightG: 2378 },
  36: { lengthCm: 47.3, weightG: 2600 },
  37: { lengthCm: 48.3, weightG: 2800 },
  38: { lengthCm: 49.3, weightG: 3000 },
  39: { lengthCm: 50.1, weightG: 3186 },
};

export function completedWeeksOn(week: number): number {
  return week - 1;
}

export function weekFacts(week: number): WeekFacts {
  const completedWeeks = completedWeeksOn(week);
  const lengthMethod = completedWeeks < CROWN_HEEL_FROM_WEEKS ? "crown-rump" : "crown-heel";
  const heartRate = week >= FETAL_HEART_FROM_WEEK ? FETAL_HEART : EARLY_HEART[week];
  const estimate = ESTIMATED_SIZES[completedWeeks];
  const size = estimate ?? SIZES[completedWeeks];
  if (!size) return { lengthMethod, heartRate };
  return {
    lengthMethod,
    fruit: FRUITS[completedWeeks - FIRST_SIZED_WEEKS],
    estimated: estimate !== undefined,
    heartRate,
    ...size,
  };
}

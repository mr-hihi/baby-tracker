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
  "watermelon",
] as const;

export type Fruit = (typeof FRUITS)[number];

export type WeekFacts = {
  fruit?: Fruit;
  lengthCm?: number;
  weightG?: number;
  heartRate?: BeatRange;
};

const FETAL_HEART: BeatRange = [120, 160];
const FIRST_FRUIT_WEEK = 4;

const MEASUREMENTS: Record<number, Omit<WeekFacts, "fruit">> = {
  4: { lengthCm: 0.1, weightG: 0.1 },
  5: { lengthCm: 0.2, weightG: 0.1 },
  6: { lengthCm: 0.5, weightG: 0.2, heartRate: [100, 120] },
  7: { lengthCm: 1.0, weightG: 0.5, heartRate: [120, 160] },
  8: { lengthCm: 1.6, weightG: 1, heartRate: [140, 170] },
  9: { lengthCm: 2.3, weightG: 2, heartRate: [150, 175] },
  10: { lengthCm: 3.1, weightG: 4, heartRate: [155, 180] },
  11: { lengthCm: 4.1, weightG: 7, heartRate: [150, 175] },
  12: { lengthCm: 5.4, weightG: 14, heartRate: [140, 170] },
  13: { lengthCm: 7.4, weightG: 23 },
  14: { lengthCm: 8.7, weightG: 43 },
  15: { lengthCm: 10.1, weightG: 70 },
  16: { lengthCm: 11.6, weightG: 100 },
  17: { lengthCm: 13.0, weightG: 140 },
  18: { lengthCm: 14.2, weightG: 190 },
  19: { lengthCm: 15.3, weightG: 240 },
  20: { lengthCm: 25.6, weightG: 300 },
  21: { lengthCm: 26.7, weightG: 360 },
  22: { lengthCm: 27.8, weightG: 430 },
  23: { lengthCm: 28.9, weightG: 501 },
  24: { lengthCm: 30.0, weightG: 600 },
  25: { lengthCm: 34.6, weightG: 660 },
  26: { lengthCm: 35.6, weightG: 760 },
  27: { lengthCm: 36.6, weightG: 875 },
  28: { lengthCm: 37.6, weightG: 1005 },
  29: { lengthCm: 38.6, weightG: 1153 },
  30: { lengthCm: 39.9, weightG: 1319 },
  31: { lengthCm: 41.1, weightG: 1502 },
  32: { lengthCm: 42.4, weightG: 1702 },
  33: { lengthCm: 43.7, weightG: 1918 },
  34: { lengthCm: 45.0, weightG: 2146 },
  35: { lengthCm: 46.2, weightG: 2383 },
  36: { lengthCm: 47.4, weightG: 2622 },
  37: { lengthCm: 48.6, weightG: 2859 },
  38: { lengthCm: 49.8, weightG: 3083 },
  39: { lengthCm: 50.7, weightG: 3288 },
  40: { lengthCm: 51.2, weightG: 3462 },
};

export const CROWN_TO_HEEL_FROM_WEEK = 20;

export function weekFacts(week: number): WeekFacts {
  const measured = MEASUREMENTS[week];
  if (!measured) return {};
  return {
    fruit: FRUITS[week - FIRST_FRUIT_WEEK],
    heartRate: week >= 13 ? FETAL_HEART : undefined,
    ...measured,
  };
}

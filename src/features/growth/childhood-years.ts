import type { BeatRange } from "./pregnancy-weeks";

export type Gender = "boy" | "girl";

export type BodySize = { heightCm: number; weightKg: number };

type YearRow = [age: number, boyHeight: number, boyWeight: number, girlHeight: number, girlWeight: number];

const MEDIANS: YearRow[] = [
  [0, 49.9, 3.3, 49.1, 3.2],
  [1, 75.7, 9.6, 74.0, 8.9],
  [2, 87.1, 12.2, 85.7, 11.5],
  [3, 96.1, 14.3, 95.1, 13.9],
  [4, 103.3, 16.3, 102.7, 16.1],
  [5, 110.0, 18.3, 109.4, 18.2],
  [6, 116.0, 20.5, 115.1, 20.2],
  [7, 121.7, 22.9, 120.8, 22.4],
  [8, 127.3, 25.4, 126.6, 25.0],
  [9, 132.6, 28.1, 132.5, 28.2],
  [10, 137.8, 31.2, 138.6, 31.9],
  [11, 143.1, 35.0, 144.0, 36.0],
  [12, 149.1, 39.9, 151.2, 41.0],
  [13, 156.0, 45.3, 156.4, 45.8],
  [14, 163.2, 50.8, 159.8, 49.8],
  [15, 169.0, 56.0, 161.7, 52.7],
  [16, 172.9, 60.8, 162.5, 54.6],
  [17, 175.2, 64.4, 162.9, 55.9],
  [18, 176.1, 66.9, 163.1, 56.6],
];

const RESTING_HEART: [maxAge: number, range: BeatRange][] = [
  [0, [100, 160]],
  [2, [90, 150]],
  [5, [80, 140]],
  [11, [70, 120]],
  [Infinity, [60, 100]],
];

export function sizeForGender(boy: BodySize, girl: BodySize, gender?: Gender): BodySize {
  if (gender === "boy") return boy;
  if (gender === "girl") return girl;
  return { heightCm: (boy.heightCm + girl.heightCm) / 2, weightKg: (boy.weightKg + girl.weightKg) / 2 };
}

export function bodySize(age: number, gender?: Gender): BodySize {
  const [, boyHeight, boyWeight, girlHeight, girlWeight] = MEDIANS[age];
  return sizeForGender(
    { heightCm: boyHeight, weightKg: boyWeight },
    { heightCm: girlHeight, weightKg: girlWeight },
    gender,
  );
}

export function restingHeartRate(age: number): BeatRange {
  return RESTING_HEART.find(([maxAge]) => age <= maxAge)![1];
}

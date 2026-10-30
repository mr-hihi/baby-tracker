import { sizeForGender, type BodySize, type Gender } from "./childhood-years";

type MonthRow = [month: number, boyLength: number, boyWeight: number, girlLength: number, girlWeight: number];

const MEDIANS: MonthRow[] = [
  [0, 49.9, 3.3, 49.1, 3.2],
  [1, 54.7, 4.5, 53.7, 4.2],
  [2, 58.4, 5.6, 57.1, 5.1],
  [3, 61.4, 6.4, 59.8, 5.8],
  [4, 63.9, 7.0, 62.1, 6.4],
  [5, 65.9, 7.5, 64.0, 6.9],
  [6, 67.6, 7.9, 65.7, 7.3],
  [7, 69.2, 8.3, 67.3, 7.6],
  [8, 70.6, 8.6, 68.7, 7.9],
  [9, 72.0, 8.9, 70.1, 8.2],
  [10, 73.3, 9.2, 71.5, 8.5],
  [11, 74.5, 9.4, 72.8, 8.7],
  [12, 75.7, 9.6, 74.0, 8.9],
  [13, 76.9, 9.9, 75.2, 9.2],
  [14, 78.0, 10.1, 76.4, 9.4],
  [15, 79.1, 10.3, 77.5, 9.6],
  [16, 80.2, 10.5, 78.6, 9.8],
  [17, 81.2, 10.7, 79.7, 10.0],
  [18, 82.3, 10.9, 80.7, 10.2],
  [19, 83.2, 11.1, 81.7, 10.4],
  [20, 84.2, 11.3, 82.7, 10.6],
  [21, 85.1, 11.5, 83.7, 10.9],
  [22, 86.0, 11.8, 84.6, 11.1],
  [23, 86.9, 12.0, 85.5, 11.3],
  [24, 87.1, 12.2, 85.7, 11.5],
];

export function monthBodySize(month: number, gender?: Gender): BodySize {
  const [, boyLength, boyWeight, girlLength, girlWeight] = MEDIANS[month];
  return sizeForGender(
    { heightCm: boyLength, weightKg: boyWeight },
    { heightCm: girlLength, weightKg: girlWeight },
    gender,
  );
}

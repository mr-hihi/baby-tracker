import type { IsoDate } from "@/lib/date";

type PrenatalTestFields = {
  id: string;
  stepKind: "week";
  from: number;
  to: number;
};

export const PRENATAL_TESTS = [
  { id: "nipt", stepKind: "week", from: 10, to: 14 },
] as const satisfies readonly PrenatalTestFields[];

export type PrenatalTest = (typeof PRENATAL_TESTS)[number];
export type PrenatalTestId = PrenatalTest["id"];

export type PrenatalTestRecord = Partial<Record<string, IsoDate>>;

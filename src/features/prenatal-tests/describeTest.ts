import type { Dictionary } from "@/features/locale/dictionaries";
import { fill } from "@/features/locale/format";
import type { PrenatalTest } from "./prenatal-tests";

export type TestDescription = { name: string; weeks: string; note: string };

export function describeTest(test: PrenatalTest, dict: Dictionary): TestDescription {
  const { name, note } = dict.prenatalTestTexts[test.id];
  return { name, weeks: fill(dict.prenatalTest.weeks, { from: test.from, to: test.to }), note };
}

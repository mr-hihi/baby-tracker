import { describe, expect, it } from "vitest";
import { PRENATAL_TESTS } from "./prenatal-tests";

describe("PRENATAL_TESTS", () => {
  it("lists NIPT for weeks 10–14", () => {
    expect(PRENATAL_TESTS).toEqual([{ id: "nipt", stepKind: "week", from: 10, to: 14 }]);
  });

  it("has unique ids", () => {
    expect(new Set(PRENATAL_TESTS.map((test) => test.id)).size).toBe(PRENATAL_TESTS.length);
  });

  it("keeps every window inside weeks 1–40 and never ends it before it starts", () => {
    for (const test of PRENATAL_TESTS) {
      expect(test.from, test.id).toBeGreaterThanOrEqual(1);
      expect(test.to, test.id).toBeLessThanOrEqual(40);
      expect(test.from, test.id).toBeLessThanOrEqual(test.to);
    }
  });

  it("orders tests by the week they start", () => {
    const starts = PRENATAL_TESTS.map((test) => test.from);
    expect(starts).toEqual([...starts].sort((a, b) => a - b));
  });
});

import { describe, expect, it } from "vitest";
import {
  ageAtMonth,
  ageStep,
  compareSteps,
  GROWTH_STEPS,
  isSameStep,
  monthsAfterBirth,
  monthsInAge,
  monthStep,
  nextStep,
  previousStep,
  stepIndex,
  stepWindow,
  weekStep,
} from "./steps";

describe("GROWTH_STEPS", () => {
  it("runs weeks 1–40 then ages 0–18", () => {
    expect(GROWTH_STEPS).toHaveLength(59);
    expect(GROWTH_STEPS[0]).toEqual(weekStep(1));
    expect(GROWTH_STEPS[58]).toEqual(ageStep(18));
  });

  it("leaves months out of the timeline", () => {
    expect(GROWTH_STEPS.some((step) => step.kind === "month")).toBe(false);
  });
});

describe("stepIndex", () => {
  it("places week 40 right before age 0", () => {
    expect(stepIndex(ageStep(0)) - stepIndex(weekStep(40))).toBe(1);
  });
});

describe("isSameStep", () => {
  it("is false for the same number of a different kind", () => {
    expect(isSameStep(weekStep(1), ageStep(1))).toBe(false);
    expect(isSameStep(monthStep(1), ageStep(1))).toBe(false);
  });

  it("is true for an equal step", () => {
    expect(isSameStep(ageStep(3), ageStep(3))).toBe(true);
  });
});

describe("nextStep / previousStep", () => {
  it("moves from week 40 to age 0", () => {
    expect(nextStep(weekStep(40))).toEqual(ageStep(0));
  });

  it("moves from age 0 back to week 40", () => {
    expect(previousStep(ageStep(0))).toEqual(weekStep(40));
  });

  it("has nothing before week 1", () => {
    expect(previousStep(weekStep(1))).toBeUndefined();
  });

  it("has nothing after age 18", () => {
    expect(nextStep(ageStep(18))).toBeUndefined();
  });

  it("moves between months", () => {
    expect(nextStep(monthStep(5))).toEqual(monthStep(6));
    expect(previousStep(monthStep(3))).toEqual(monthStep(2));
  });

  it("stays within months", () => {
    expect(previousStep(monthStep(0))).toBeUndefined();
    expect(nextStep(monthStep(24))).toBeUndefined();
  });
});

describe("stepWindow", () => {
  it("centres on the selected week", () => {
    expect(stepWindow(weekStep(28)).map((step) => step.value)).toEqual([26, 27, 28, 29, 30]);
  });

  it("stops at the first week", () => {
    expect(stepWindow(weekStep(1)).map((step) => step.value)).toEqual([1, 2, 3, 4, 5]);
  });

  it("stops at the last week without mixing in ages", () => {
    expect(stepWindow(weekStep(40))).toEqual([36, 37, 38, 39, 40].map(weekStep));
  });

  it("stays within ages", () => {
    expect(stepWindow(ageStep(0))).toEqual([0, 1, 2, 3, 4].map(ageStep));
  });

  it("centres on the selected month", () => {
    expect(stepWindow(monthStep(12))).toEqual([10, 11, 12, 13, 14].map(monthStep));
  });

  it("stops at the first and last month", () => {
    expect(stepWindow(monthStep(0))).toEqual([0, 1, 2, 3, 4].map(monthStep));
    expect(stepWindow(monthStep(24))).toEqual([20, 21, 22, 23, 24].map(monthStep));
  });
});

describe("monthsAfterBirth", () => {
  it("is the month itself for a month", () => {
    expect(monthsAfterBirth({ kind: "month", value: 7 })).toBe(7);
  });

  it("is twelve times the years for an age", () => {
    expect(monthsAfterBirth({ kind: "age", value: 3 })).toBe(36);
  });
});

describe("compareSteps", () => {
  it("orders weeks by number", () => {
    expect(compareSteps(weekStep(10), weekStep(30))).toBeLessThan(0);
    expect(compareSteps(weekStep(30), weekStep(10))).toBeGreaterThan(0);
    expect(compareSteps(weekStep(12), weekStep(12))).toBe(0);
  });

  it("puts every week before every month and age", () => {
    expect(compareSteps(weekStep(40), monthStep(0))).toBe(-1);
    expect(compareSteps(weekStep(40), ageStep(0))).toBe(-1);
  });

  it("puts every month and age after every week", () => {
    expect(compareSteps(monthStep(0), weekStep(1))).toBe(1);
    expect(compareSteps(ageStep(0), weekStep(1))).toBe(1);
  });

  it("orders months by number", () => {
    expect(compareSteps(monthStep(2), monthStep(9))).toBeLessThan(0);
  });

  it("matches month 12 with age 1 and month 24 with age 2", () => {
    expect(compareSteps(monthStep(12), ageStep(1))).toBe(0);
    expect(compareSteps(ageStep(2), monthStep(24))).toBe(0);
  });

  it("orders a month against an age", () => {
    expect(compareSteps(monthStep(11), ageStep(1))).toBeLessThan(0);
    expect(compareSteps(ageStep(3), monthStep(24))).toBeGreaterThan(0);
  });
});

describe("ageAtMonth", () => {
  it("is the completed years", () => {
    expect([0, 11, 12, 23, 24].map(ageAtMonth)).toEqual([0, 0, 1, 1, 2]);
  });
});

describe("monthsInAge", () => {
  it("lists months 0–11 for age 0", () => {
    expect(monthsInAge(0)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it("lists months 12–24 for age 1 so month 24 stays reachable", () => {
    expect(monthsInAge(1)).toEqual([12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]);
  });

  it("has no months from age 2", () => {
    expect(monthsInAge(2)).toEqual([]);
  });
});

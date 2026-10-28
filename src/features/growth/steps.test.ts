import { describe, expect, it } from "vitest";
import { ageStep, GROWTH_STEPS, isSameStep, nextStep, previousStep, stepIndex, stepWindow, weekStep } from "./steps";

describe("GROWTH_STEPS", () => {
  it("runs weeks 1–40 then ages 0–18", () => {
    expect(GROWTH_STEPS).toHaveLength(59);
    expect(GROWTH_STEPS[0]).toEqual(weekStep(1));
    expect(GROWTH_STEPS[58]).toEqual(ageStep(18));
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
});

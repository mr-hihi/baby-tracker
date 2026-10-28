import { describe, expect, it } from "vitest";
import { babyImagePath, fruitImagePath, growthStats } from "./stats";
import { ageStep, weekStep } from "./steps";

describe("growthStats — pregnancy weeks", () => {
  it("has no measurements before week 4", () => {
    expect(growthStats(weekStep(3))).toEqual({ measure: "length" });
  });

  it("has a size and fruit but no heartbeat in week 4", () => {
    expect(growthStats(weekStep(4))).toEqual({
      measure: "length",
      sizeCm: 0.1,
      weightG: 0.1,
      heartRate: undefined,
      fruit: "poppy-seed",
    });
  });

  it("uses the early heartbeat range in week 10", () => {
    expect(growthStats(weekStep(10)).heartRate).toEqual([155, 180]);
  });

  it("uses the standard fetal heartbeat from week 13", () => {
    expect(growthStats(weekStep(28))).toEqual({
      measure: "length",
      sizeCm: 37.6,
      weightG: 1005,
      heartRate: [120, 160],
      fruit: "pomelo",
    });
  });

  it("ends with a watermelon in week 40", () => {
    expect(growthStats(weekStep(40)).fruit).toBe("watermelon");
  });
});

describe("growthStats — ages", () => {
  it("uses boy medians for a boy", () => {
    expect(growthStats(ageStep(18), "boy")).toEqual({
      measure: "height",
      sizeCm: 176.1,
      weightG: 66900,
      heartRate: [60, 100],
    });
  });

  it("uses girl medians for a girl", () => {
    expect(growthStats(ageStep(1), "girl")).toMatchObject({ sizeCm: 74.0, weightG: 8900, heartRate: [90, 150] });
  });

  it("averages boy and girl when gender is unknown", () => {
    expect(growthStats(ageStep(0))).toMatchObject({ sizeCm: 49.5, weightG: 3250, heartRate: [100, 160] });
  });

  it("uses the 3–5 heartbeat range at 5", () => {
    expect(growthStats(ageStep(5)).heartRate).toEqual([80, 140]);
  });

  it("uses the 6–11 heartbeat range at 11", () => {
    expect(growthStats(ageStep(11)).heartRate).toEqual([70, 120]);
  });
});

describe("babyImagePath", () => {
  it("pads the pregnancy week", () => {
    expect(babyImagePath(weekStep(7), "girl")).toBe("/assets/baby/week-07.svg");
  });

  it("uses the gender folder after birth", () => {
    expect(babyImagePath(ageStep(5), "boy")).toBe("/assets/baby/boy/age-05.svg");
  });

  it("uses the neutral image when gender is unknown", () => {
    expect(babyImagePath(ageStep(12))).toBe("/assets/baby/age-12.svg");
  });
});

describe("fruitImagePath", () => {
  it("points at the size folder", () => {
    expect(fruitImagePath("mini-watermelon")).toBe("/assets/size/mini-watermelon.svg");
  });
});

import { describe, expect, it } from "vitest";
import { babyImagePath, fruitImagePath, growthStats } from "./stats";
import { monthBodySize } from "./infant-months";
import { ageStep, monthStep, weekStep } from "./steps";

describe("growthStats — pregnancy weeks", () => {
  it("has no measurements before week 5", () => {
    expect(growthStats(weekStep(4))).toEqual({ measure: "crown-rump" });
  });

  it("shows an estimated size and fruit but no heartbeat in week 5", () => {
    expect(growthStats(weekStep(5))).toEqual({
      measure: "crown-rump",
      sizeCm: 0.1,
      weightG: 0.1,
      heartRate: undefined,
      fruit: "poppy-seed",
      estimated: true,
    });
  });

  it("stops estimating from week 9", () => {
    expect(growthStats(weekStep(9))).toEqual({
      measure: "crown-rump",
      sizeCm: 1.6,
      weightG: 1,
      heartRate: [150, 175],
      fruit: "raspberry",
      estimated: false,
    });
  });

  it("shows the row for the completed weeks", () => {
    expect(growthStats(weekStep(22))).toEqual({
      measure: "crown-heel",
      sizeCm: 27.4,
      weightG: 400,
      heartRate: [120, 160],
      fruit: "carrot",
      estimated: false,
    });
  });

  it("measures crown to rump up to week 20 and crown to heel from week 21", () => {
    expect(growthStats(weekStep(20))).toMatchObject({ measure: "crown-rump", sizeCm: 15.3, weightG: 240 });
    expect(growthStats(weekStep(21))).toMatchObject({ measure: "crown-heel", sizeCm: 25.7, weightG: 330 });
  });

  it("uses the early heartbeat range in week 10", () => {
    expect(growthStats(weekStep(10)).heartRate).toEqual([155, 180]);
  });

  it("uses the standard fetal heartbeat from week 13", () => {
    expect(growthStats(weekStep(13)).heartRate).toEqual([120, 160]);
  });

  it("ends with the 39-week row and a pumpkin in week 40", () => {
    expect(growthStats(weekStep(40))).toMatchObject({ sizeCm: 50.1, weightG: 3186, fruit: "pumpkin" });
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

describe("growthStats — months", () => {
  it("uses boy medians for a boy", () => {
    expect(growthStats(monthStep(6), "boy")).toEqual({
      measure: "length",
      sizeCm: 67.6,
      weightG: 7900,
      heartRate: [100, 160],
    });
  });

  it("uses girl medians for a girl", () => {
    expect(growthStats(monthStep(6), "girl")).toMatchObject({ sizeCm: 65.7, weightG: 7300 });
  });

  it("averages boy and girl when gender is unknown", () => {
    expect(growthStats(monthStep(0))).toMatchObject({ sizeCm: 49.5, weightG: 3250 });
  });

  it("reads the heartbeat of the age the month falls in", () => {
    expect(growthStats(monthStep(11)).heartRate).toEqual(growthStats(ageStep(0)).heartRate);
    expect(growthStats(monthStep(12)).heartRate).toEqual(growthStats(ageStep(1)).heartRate);
  });

  it("matches the age figures at months 0, 12 and 24", () => {
    for (const [month, age] of [[0, 0], [12, 1], [24, 2]]) {
      expect(growthStats(monthStep(month), "boy").sizeCm).toBe(growthStats(ageStep(age), "boy").sizeCm);
      expect(growthStats(monthStep(month), "boy").weightG).toBe(growthStats(ageStep(age), "boy").weightG);
    }
  });

  it("is a length until month 23 and a height from month 24", () => {
    expect(growthStats(monthStep(23)).measure).toBe("length");
    expect(growthStats(monthStep(24)).measure).toBe("height");
  });
});

describe("monthBodySize", () => {
  it("returns the boy row, the girl row, or their average", () => {
    expect(monthBodySize(6, "boy")).toEqual({ heightCm: 67.6, weightKg: 7.9 });
    expect(monthBodySize(6, "girl")).toEqual({ heightCm: 65.7, weightKg: 7.3 });
    expect(monthBodySize(6).heightCm).toBeCloseTo(66.65, 5);
    expect(monthBodySize(6).weightKg).toBeCloseTo(7.6, 5);
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

  it("uses the image of the age the month falls in", () => {
    expect(babyImagePath(monthStep(6))).toBe("/assets/baby/age-00.svg");
    expect(babyImagePath(monthStep(14), "girl")).toBe("/assets/baby/girl/age-01.svg");
    expect(babyImagePath(monthStep(24), "boy")).toBe("/assets/baby/boy/age-02.svg");
  });
});

describe("fruitImagePath", () => {
  it("points at the size folder", () => {
    expect(fruitImagePath("mini-watermelon")).toBe("/assets/size/mini-watermelon.svg");
  });
});

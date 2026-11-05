import { describe, expect, it } from "vitest";
import { en } from "@/features/locale/dictionaries/en";
import { formatLength, formatSizeStat, formatWeight, formatWeightStat } from "@/features/locale/format";
import { bodySize, type BodySize, type Gender } from "./childhood-years";
import { babyImagePath, fruitImagePath, growthStats } from "./stats";
import { monthBodySize } from "./infant-months";
import { ageStep, MAX_AGE, MAX_MONTH, monthStep, weekStep, type GrowthStep } from "./steps";

const GENDERS = ["boy", "girl", undefined] as const;

type ShownFigure = { value: number; delta?: number };

function readShownFigure(text: string): ShownFigure {
  const [, value, delta] = /^([\d.]+) (?:cm|kg)(?: \(([+-][\d.]+)\))?$/.exec(text)!;
  return { value: Number(value), delta: delta === undefined ? undefined : Number(delta) };
}

type StepFor = (value: number) => GrowthStep;

function shownChange(stepFor: StepFor, value: number, gender: Gender | undefined, format: typeof formatSizeStat) {
  const current = readShownFigure(format(growthStats(stepFor(value), gender), "en", en));
  const previous = readShownFigure(format(growthStats(stepFor(value - 1), gender), "en", en));
  const difference = Number((current.value - previous.value).toFixed(3));
  const { kind } = stepFor(value);
  return { step: `${kind} ${value}`, gender: gender ?? "any", delta: current.delta, difference };
}

function shownChanges(stepFor: StepFor, values: number[], format: typeof formatSizeStat) {
  return values.flatMap((value) => GENDERS.map((gender) => shownChange(stepFor, value, gender, format)));
}

function valuesBetween(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

const SIZE_CHANGES = [
  ...shownChanges(monthStep, valuesBetween(1, MAX_MONTH - 1), formatSizeStat),
  ...shownChanges(ageStep, [1, ...valuesBetween(3, MAX_AGE)], formatSizeStat),
];
const WEIGHT_CHANGES = [
  ...shownChanges(monthStep, valuesBetween(1, MAX_MONTH), formatWeightStat),
  ...shownChanges(ageStep, [...valuesBetween(1, 10), ...valuesBetween(12, MAX_AGE)], formatWeightStat),
];

function changedFigures(step: GrowthStep, gender: Gender | undefined, raw: BodySize) {
  const stats = growthStats(step, gender);
  const figures = [
    { measure: "size", before: formatLength(raw.heightCm, "en"), after: formatLength(stats.sizeCm!, "en") },
    {
      measure: "weight",
      before: formatWeight(Math.round(raw.weightKg * 1000), "en", en),
      after: formatWeight(stats.weightG!, "en", en),
    },
  ];
  return figures
    .filter(({ before, after }) => before !== after)
    .map((figure) => ({ step: `${step.kind} ${step.value}`, gender: gender ?? "any", ...figure }));
}

const STEPS_AFTER_BIRTH = [
  ...Array.from({ length: MAX_MONTH + 1 }, (_, month) => ({ step: monthStep(month), sizeFor: monthBodySize })),
  ...Array.from({ length: MAX_AGE + 1 }, (_, age) => ({ step: ageStep(age), sizeFor: bodySize })),
];

const FIGURES_CHANGED_BY_ROUNDING = STEPS_AFTER_BIRTH.flatMap(({ step, sizeFor }) =>
  GENDERS.flatMap((gender) => changedFigures(step, gender, sizeFor(step.value, gender))),
);

describe("growthStats — pregnancy weeks", () => {
  it("has no measurements before week 4", () => {
    expect(growthStats(weekStep(3))).toEqual({ measure: "crown-rump" });
  });

  it("shows an estimated size and fruit but no heartbeat in week 4", () => {
    expect(growthStats(weekStep(4))).toEqual({
      measure: "crown-rump",
      sizeCm: 0.1,
      weightG: 0.1,
      heartRate: undefined,
      fruit: "poppy-seed",
      estimated: true,
    });
  });

  it("stops estimating from week 8", () => {
    expect(growthStats(weekStep(7))).toMatchObject({ sizeCm: 1.0, estimated: true });
    expect(growthStats(weekStep(8))).toEqual({
      measure: "crown-rump",
      sizeCm: 1.6,
      weightG: 1,
      heartRate: [140, 170],
      fruit: "raspberry",
      estimated: false,
    });
  });

  it("shows the reference row of the same week", () => {
    expect(growthStats(weekStep(21))).toMatchObject({ sizeCm: 27.4, weightG: 400, fruit: "carrot" });
    expect(growthStats(weekStep(22))).toEqual({
      measure: "crown-heel",
      sizeCm: 29.0,
      weightG: 476,
      heartRate: [120, 160],
      fruit: "papaya",
      estimated: false,
    });
  });

  it("measures crown to rump up to week 19 and crown to heel from week 20", () => {
    expect(growthStats(weekStep(19))).toMatchObject({ measure: "crown-rump", sizeCm: 15.3, weightG: 240 });
    expect(growthStats(weekStep(20))).toMatchObject({ measure: "crown-heel", sizeCm: 25.7, weightG: 330 });
  });

  it("uses the early heartbeat range in week 10", () => {
    expect(growthStats(weekStep(10)).heartRate).toEqual([155, 180]);
  });

  it("uses the standard fetal heartbeat from week 13", () => {
    expect(growthStats(weekStep(13)).heartRate).toEqual([120, 160]);
  });

  it("ends with a pumpkin in week 39 and a watermelon in week 40", () => {
    expect(growthStats(weekStep(39))).toMatchObject({ sizeCm: 50.1, weightG: 3186, fruit: "pumpkin" });
    expect(growthStats(weekStep(40))).toMatchObject({ sizeCm: 51.0, weightG: 3338, fruit: "watermelon" });
  });
});

describe("growthStats — ages", () => {
  it("uses boy medians for a boy", () => {
    expect(growthStats(ageStep(18), "boy")).toEqual({
      measure: "height",
      sizeCm: 176.1,
      weightG: 67300,
      sizeDeltaCm: 0.9,
      weightDeltaG: 2600,
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
      sizeDeltaCm: 1.7,
      weightDeltaG: 400,
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

describe("growthStats — change since the previous month", () => {
  it("has no change in month 0", () => {
    expect(growthStats(monthStep(0))).toEqual({
      measure: "length",
      sizeCm: 49.5,
      weightG: 3250,
      heartRate: [100, 160],
    });
  });

  it("compares the boy-girl average with the previous average", () => {
    expect(growthStats(monthStep(1))).toMatchObject({ sizeCm: 54.2, sizeDeltaCm: 4.7, weightDeltaG: 1100 });
  });

  it("rounds an average from 10 kg to 100 g before taking the change", () => {
    expect(growthStats(monthStep(16))).toMatchObject({ weightG: 10200, weightDeltaG: 250 });
  });

  it("hides the length change when month 24 switches to a standing height", () => {
    expect(growthStats(monthStep(24), "boy")).toEqual({
      measure: "height",
      sizeCm: 87.1,
      weightG: 12200,
      sizeDeltaBreak: "method",
      weightDeltaG: 200,
      heartRate: [90, 150],
    });
  });

});

describe("growthStats — change since the previous year", () => {
  it("has no change at age 0, measured lying down", () => {
    expect(growthStats(ageStep(0), "girl")).toEqual({
      measure: "length",
      sizeCm: 49.1,
      weightG: 3200,
      heartRate: [100, 160],
    });
  });

  it("compares age 1 with age 0, both lying lengths", () => {
    expect(growthStats(ageStep(1))).toEqual({
      measure: "length",
      sizeCm: 74.9,
      weightG: 9250,
      sizeDeltaCm: 25.4,
      weightDeltaG: 6000,
      heartRate: [90, 150],
    });
  });

  it.each(GENDERS)("hides the height change at age 2, the first standing height (%s)", (gender) => {
    expect(growthStats(ageStep(2), gender)).toMatchObject({ measure: "height", sizeDeltaBreak: "method" });
  });

  it("keeps the weight change at age 2", () => {
    expect(growthStats(ageStep(2), "boy")).toMatchObject({ weightDeltaG: 2600 });
  });

  it("joins the WHO 2006 and WHO 2007 tables at age 6", () => {
    expect(growthStats(ageStep(6), "boy")).toEqual({
      measure: "height",
      sizeCm: 116,
      weightG: 20500,
      sizeDeltaCm: 6,
      weightDeltaG: 2200,
      heartRate: [70, 120],
    });
  });

  it.each(GENDERS)("hides the weight change at age 11, the first CDC weight (%s)", (gender) => {
    expect(growthStats(ageStep(11), gender)).toMatchObject({ weightDeltaBreak: "source" });
  });

  it("keeps the height change at age 11", () => {
    expect(growthStats(ageStep(11), "girl")).toEqual({
      measure: "height",
      sizeCm: 145,
      weightG: 37400,
      sizeDeltaCm: 6.4,
      weightDeltaBreak: "source",
      heartRate: [70, 120],
    });
  });

  it("compares CDC weights from age 12", () => {
    expect(growthStats(ageStep(12), "boy")).toMatchObject({ weightG: 40700, weightDeltaG: 4600 });
  });

  it("takes the change from the rounded average at age 8", () => {
    expect(growthStats(ageStep(8))).toMatchObject({ sizeCm: 127, sizeDeltaCm: 5.7 });
  });

  it("takes the change from the rounded averages at ages 11 and 12", () => {
    expect(growthStats(ageStep(12))).toMatchObject({ sizeCm: 150.2, sizeDeltaCm: 6.1 });
  });
});

describe("growthStats — every shown change", () => {
  it.each(SIZE_CHANGES)(
    "shows the size change of $step ($gender) as the difference of the shown sizes",
    ({ delta, difference }) => {
      expect(delta).toBe(difference);
    },
  );

  it.each(SIZE_CHANGES)("shows a growing size in $step ($gender)", ({ delta }) => {
    expect(Math.sign(delta!)).toBe(1);
  });

  it.each(WEIGHT_CHANGES)(
    "shows the weight change of $step ($gender) as the difference of the shown weights",
    ({ delta, difference }) => {
      expect(delta).toBe(difference);
    },
  );

  it.each(WEIGHT_CHANGES)("shows a growing weight in $step ($gender)", ({ delta }) => {
    expect(Math.sign(delta!)).toBe(1);
  });
});

describe("growthStats — rounding at the source", () => {
  it("changes only the two averages whose half used to round down", () => {
    expect(FIGURES_CHANGED_BY_ROUNDING).toEqual([
      { step: "age 8", gender: "any", measure: "size", before: "126.9 cm", after: "127 cm" },
      { step: "age 12", gender: "any", measure: "size", before: "150.1 cm", after: "150.2 cm" },
    ]);
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

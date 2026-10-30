import { describe, expect, it } from "vitest";
import { en } from "@/features/locale/dictionaries/en";
import { ageStep, monthStep, weekStep } from "@/features/growth/steps";
import { CARE_ITEMS, careGroupsForStep, type CareGroup } from "./care-items";

const LIMITS = { week: [1, 40], month: [0, 24], age: [2, 18] } as const;
const AMOUNT_WITH_UNIT = /\d[\d,.–]*\s(mg|mcg|IU)\b/;
const FREQUENCY = /\b(a day|once|every|on campaign days)\b/;

function ids(group: CareGroup | undefined): string[] {
  return group?.entries.map((entry) => entry.item.id) ?? [];
}

function groupOf(groups: CareGroup[], category: string): CareGroup | undefined {
  return groups.find((group) => group.category === category);
}

describe("CARE_ITEMS", () => {
  it("has unique ids", () => {
    expect(new Set(CARE_ITEMS.map((item) => item.id)).size).toBe(CARE_ITEMS.length);
  });

  it("keeps every window inside its step kind", () => {
    for (const item of CARE_ITEMS) {
      const [min, max] = LIMITS[item.stepKind];
      expect(item.from, item.id).toBeGreaterThanOrEqual(min);
      expect(item.to, item.id).toBeLessThanOrEqual(max);
      expect(item.from, item.id).toBeLessThanOrEqual(item.to);
    }
  });

  it("names a valid subject and source", () => {
    for (const item of CARE_ITEMS) {
      expect(["mother", "baby"], item.id).toContain(item.subject);
      expect(["moh", "who"], item.id).toContain(item.source);
    }
  });

  it("states an amount, a unit and a frequency in every supplement detail", () => {
    for (const item of CARE_ITEMS.filter((candidate) => candidate.category === "supplement")) {
      const { detail } = en.careItems[item.id];
      expect(detail, item.id).toMatch(AMOUNT_WITH_UNIT);
      expect(detail, item.id).toMatch(FREQUENCY);
    }
  });

  it("covers every week, month and age from 2", () => {
    const weeks = Array.from({ length: 40 }, (_, i) => weekStep(i + 1));
    const months = Array.from({ length: 25 }, (_, i) => monthStep(i));
    const ages = Array.from({ length: 17 }, (_, i) => ageStep(i + 2));
    for (const step of [...weeks, ...months, ...ages]) {
      expect(careGroupsForStep(step).length, `${step.kind} ${step.value}`).toBeGreaterThan(0);
    }
  });
});

describe("careGroupsForStep", () => {
  it("groups week 1 in the order supplement, eat, avoid", () => {
    const groups = careGroupsForStep(weekStep(1));
    expect(groups.map((group) => group.category)).toEqual(["supplement", "eat", "avoid"]);
    expect(ids(groups[0])).toEqual(["folic-acid"]);
    expect(ids(groups[1])).toEqual(["varied-meals"]);
    expect(ids(groups[2])).toEqual(["no-alcohol-smoking", "no-raw-food", "limit-caffeine"]);
  });

  it("marks an item new only on the step it starts", () => {
    const week1 = careGroupsForStep(weekStep(1)).flatMap((group) => group.entries);
    const week2 = careGroupsForStep(weekStep(2)).flatMap((group) => group.entries);
    expect(week1.every((entry) => entry.isNew)).toBe(true);
    expect(week2.some((entry) => entry.isNew)).toBe(false);
  });

  it("lists a new item before the ones already running", () => {
    expect(ids(groupOf(careGroupsForStep(weekStep(5)), "eat"))).toEqual(["small-meals", "varied-meals"]);
    expect(ids(groupOf(careGroupsForStep(weekStep(20)), "supplement"))).toEqual(["calcium", "iron-folic-acid"]);
  });

  it("keeps the table order between items that are both old", () => {
    expect(ids(groupOf(careGroupsForStep(weekStep(14)), "eat"))).toEqual(["fibre-water", "varied-meals"]);
    expect(ids(groupOf(careGroupsForStep(weekStep(21)), "supplement"))).toEqual(["iron-folic-acid", "calcium"]);
  });

  it("drops a group with no item", () => {
    expect(careGroupsForStep(ageStep(5)).map((group) => group.category)).toEqual(["eat", "avoid"]);
  });

  it("has nothing for age 0 and age 1, which are covered month by month", () => {
    expect(careGroupsForStep(ageStep(0))).toEqual([]);
    expect(careGroupsForStep(ageStep(1))).toEqual([]);
  });

  it("shows the subject only when it differs from the page default", () => {
    const week = careGroupsForStep(weekStep(1)).flatMap((group) => group.entries);
    expect(week.some((entry) => entry.showsSubject)).toBe(false);

    const month = careGroupsForStep(monthStep(0)).flatMap((group) => group.entries);
    const flagged = month.filter((entry) => entry.showsSubject).map((entry) => entry.item.id);
    expect(flagged).toEqual(["mother-vitamin-a", "mother-iron", "mother-no-alcohol"]);
  });

  it("lists the toddler items from age 2, all new", () => {
    const entries = careGroupsForStep(ageStep(2)).flatMap((group) => group.entries);
    expect(entries.map((entry) => entry.item.id)).toEqual(["vitamin-a-to-36m", "varied-child-diet", "no-sugary-drinks"]);
    expect(entries.every((entry) => entry.isNew)).toBe(true);
  });

  it("does not mix step kinds", () => {
    const monthIds = careGroupsForStep(monthStep(12)).flatMap((group) => ids(group));
    expect(monthIds).toContain("family-food");
    expect(monthIds).not.toContain("varied-child-diet");
  });
});

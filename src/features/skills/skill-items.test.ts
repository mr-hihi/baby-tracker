import { describe, expect, it } from "vitest";
import { ageStep, MAX_AGE, MAX_MONTH, monthStep, PREGNANCY_WEEKS, weekStep, type GrowthStep } from "@/features/growth/steps";
import { en } from "@/features/locale/dictionaries/en";
import { vi } from "@/features/locale/dictionaries/vi";
import { SKILL_AREAS, SKILL_ITEMS, skillsForStep, type SkillEntry } from "./skill-items";

const STEP_LIMITS = { month: [0, MAX_MONTH], age: [2, MAX_AGE] } as const;
const SENTENCE_END = /[.!?](\s|$)/g;

function stepsBetween(from: number, to: number, stepFor: (value: number) => GrowthStep): GrowthStep[] {
  return Array.from({ length: to - from + 1 }, (_, i) => stepFor(from + i));
}

function idsWithNewMark(entries: SkillEntry[]): string[] {
  return entries.map(({ item, isNew }) => (isNew ? `${item.id}*` : item.id));
}

const COVERED_STEPS = [...stepsBetween(0, MAX_MONTH, monthStep), ...stepsBetween(2, MAX_AGE, ageStep)].map((step) => ({
  step: `${step.kind} ${step.value}`,
  hasSkills: skillsForStep(step).length > 0,
}));

const UNCOVERED_STEPS = [...stepsBetween(1, PREGNANCY_WEEKS, weekStep), ageStep(0), ageStep(1)];

const WINDOWS = SKILL_ITEMS.map((item) => {
  const [lowest, highest] = STEP_LIMITS[item.stepKind];
  return { id: item.id, isInside: lowest <= item.from && item.from <= item.to && item.to <= highest };
});

const AREAS = SKILL_ITEMS.map((item) => ({ id: item.id, isKnownArea: SKILL_AREAS.includes(item.area) }));

const DETAIL_SENTENCES = SKILL_ITEMS.flatMap((item) =>
  [
    { locale: "vi", detail: vi.skillItems[item.id].detail },
    { locale: "en", detail: en.skillItems[item.id].detail },
  ].map(({ locale, detail }) => ({
    id: item.id,
    locale,
    hasAtMostTwoSentences: (detail.match(SENTENCE_END) ?? []).length <= 2,
  })),
);

describe("SKILL_ITEMS", () => {
  it("has unique ids", () => {
    expect(new Set(SKILL_ITEMS.map((item) => item.id)).size).toBe(SKILL_ITEMS.length);
  });

  it.each(WINDOWS)("keeps $id inside its step kind", ({ isInside }) => {
    expect(isInside).toBe(true);
  });

  it.each(COVERED_STEPS)("gives $step at least one skill", ({ hasSkills }) => {
    expect(hasSkills).toBe(true);
  });

  it.each(AREAS)("names a known area for $id", ({ isKnownArea }) => {
    expect(isKnownArea).toBe(true);
  });

  it.each(DETAIL_SENTENCES)("keeps the $locale detail of $id to two sentences", ({ hasAtMostTwoSentences }) => {
    expect(hasAtMostTwoSentences).toBe(true);
  });
});

describe("skillsForStep", () => {
  it.each(UNCOVERED_STEPS)("has no skill for $kind $value", (step) => {
    expect(skillsForStep(step)).toEqual([]);
  });

  it("marks both first-year skills new in month 0", () => {
    expect(idsWithNewMark(skillsForStep(monthStep(0)))).toEqual(["talk-all-day*", "move-every-day*"]);
  });

  it("puts the new skill first in month 12", () => {
    expect(idsWithNewMark(skillsForStep(monthStep(12)))).toEqual(["plain-speech*", "see-the-world"]);
  });

  it("lists six skills at age 5 with the new one first", () => {
    expect(idsWithNewMark(skillsForStep(ageStep(5)))).toEqual([
      "perform*",
      "plain-speech-child",
      "read-together",
      "chores",
      "reasoned-talk",
      "swim-and-rope",
    ]);
  });

  it("keeps the table order behind the two new skills at age 13", () => {
    expect(idsWithNewMark(skillsForStep(ageStep(13)))).toEqual([
      "adult-topics*",
      "set-goals*",
      "reasoned-talk",
      "trips",
      "small-challenges",
      "plan-time",
    ]);
  });
});

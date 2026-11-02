import { describe, expect, it } from "vitest";
import { monthStep, weekStep } from "@/features/growth/steps";
import type { PrenatalTest } from "./prenatal-tests";
import { nextUpcomingTest, overdueTestsBeforeWeek, testsAtWeek, testsNeedingAction } from "./test-status";

const NIPT_DONE = { nipt: "2026-09-01" };

function ids(tests: readonly PrenatalTest[]): string[] {
  return tests.map((test) => test.id);
}

describe("testsAtWeek", () => {
  it("lists NIPT from week 10 to week 14", () => {
    expect(ids(testsAtWeek(10))).toEqual(["nipt"]);
    expect(ids(testsAtWeek(14))).toEqual(["nipt"]);
  });

  it("is empty before and after the window", () => {
    expect(testsAtWeek(9)).toEqual([]);
    expect(testsAtWeek(15)).toEqual([]);
  });
});

describe("overdueTestsBeforeWeek", () => {
  it("lists NIPT on a later week page once the baby has passed week 14", () => {
    expect(ids(overdueTestsBeforeWeek(20, weekStep(20), {}))).toEqual(["nipt"]);
  });

  it("lists NIPT on a week page after birth", () => {
    expect(ids(overdueTestsBeforeWeek(30, monthStep(3), {}))).toEqual(["nipt"]);
  });

  it("leaves out NIPT while it is still due for the baby", () => {
    expect(overdueTestsBeforeWeek(20, weekStep(12), {})).toEqual([]);
  });

  it("leaves out NIPT on its own last week", () => {
    expect(overdueTestsBeforeWeek(14, weekStep(20), {})).toEqual([]);
  });

  it("leaves out NIPT once it is recorded", () => {
    expect(overdueTestsBeforeWeek(20, weekStep(20), NIPT_DONE)).toEqual([]);
  });
});

describe("testsNeedingAction", () => {
  it("lists NIPT while it is due", () => {
    expect(ids(testsNeedingAction(weekStep(12), {}))).toEqual(["nipt"]);
  });

  it("lists NIPT once it is overdue", () => {
    expect(ids(testsNeedingAction(weekStep(20), {}))).toEqual(["nipt"]);
  });

  it("is empty before week 10", () => {
    expect(testsNeedingAction(weekStep(8), {})).toEqual([]);
  });

  it("is empty once NIPT is recorded", () => {
    expect(testsNeedingAction(weekStep(12), NIPT_DONE)).toEqual([]);
  });
});

describe("nextUpcomingTest", () => {
  it("is NIPT before week 10", () => {
    expect(nextUpcomingTest(weekStep(8), {})?.id).toBe("nipt");
  });

  it("is undefined once NIPT is due", () => {
    expect(nextUpcomingTest(weekStep(10), {})).toBeUndefined();
  });

  it("is undefined once NIPT is recorded", () => {
    expect(nextUpcomingTest(weekStep(8), NIPT_DONE)).toBeUndefined();
  });
});

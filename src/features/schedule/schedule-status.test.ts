import { describe, expect, it } from "vitest";
import { ageStep, monthStep, weekStep } from "@/features/growth/steps";
import {
  itemsAtStep,
  itemsNeedingAction,
  nextUpcomingItem,
  overdueItemsBeforeStep,
  scheduleStartDate,
  scheduleStatus,
  type ScheduledItem,
} from "./schedule-status";

const WEEKS_20_32: ScheduledItem = { id: "weeks-20-32", stepKind: "week", from: 20, to: 32 };
const WEEKS_24_36: ScheduledItem = { id: "weeks-24-36", stepKind: "week", from: 24, to: 36 };
const MONTH_0: ScheduledItem = { id: "month-0", stepKind: "month", from: 0, to: 0 };
const MONTH_2: ScheduledItem = { id: "month-2", stepKind: "month", from: 2, to: 2 };
const MONTH_24: ScheduledItem = { id: "month-24", stepKind: "month", from: 24, to: 24 };
const ITEMS = [WEEKS_20_32, WEEKS_24_36, MONTH_0, MONTH_2, MONTH_24];
const DONE = "2026-09-01";

function ids(items: readonly ScheduledItem[]): string[] {
  return items.map((item) => item.id);
}

describe("scheduleStatus", () => {
  it("is done once a date is recorded, wherever the point is", () => {
    const record = { "weeks-20-32": DONE };
    expect(scheduleStatus(WEEKS_20_32, weekStep(5), record)).toBe("done");
    expect(scheduleStatus(WEEKS_20_32, monthStep(10), record)).toBe("done");
  });

  it("is upcoming before the window opens", () => {
    expect(scheduleStatus(WEEKS_20_32, weekStep(19), {})).toBe("upcoming");
  });

  it("is due on the first and last step of the window", () => {
    expect(scheduleStatus(WEEKS_20_32, weekStep(20), {})).toBe("due");
    expect(scheduleStatus(WEEKS_20_32, weekStep(32), {})).toBe("due");
  });

  it("is overdue once the window has closed", () => {
    expect(scheduleStatus(WEEKS_20_32, weekStep(33), {})).toBe("overdue");
  });

  it("treats a pregnancy week as before every month window", () => {
    expect(scheduleStatus(MONTH_0, weekStep(40), {})).toBe("upcoming");
  });

  it("treats a point after birth as after every week window", () => {
    expect(scheduleStatus(WEEKS_20_32, monthStep(0), {})).toBe("overdue");
  });

  it("follows the month of the point", () => {
    expect(scheduleStatus(MONTH_2, monthStep(1), {})).toBe("upcoming");
    expect(scheduleStatus(MONTH_2, monthStep(2), {})).toBe("due");
    expect(scheduleStatus(MONTH_2, monthStep(3), {})).toBe("overdue");
  });

  it("matches age 2 with month 24", () => {
    expect(scheduleStatus(MONTH_24, ageStep(2), {})).toBe("due");
    expect(scheduleStatus(MONTH_24, ageStep(3), {})).toBe("overdue");
  });
});

describe("scheduleStartDate", () => {
  it("starts a week window on the first day of its first week", () => {
    expect(scheduleStartDate(WEEKS_20_32, "2026-04-01")).toBe("2026-08-12");
  });

  it("starts month 0 on the estimated birth date", () => {
    expect(scheduleStartDate(MONTH_0, "2026-04-01")).toBe("2027-01-06");
  });

  it("starts a month window that many months after birth", () => {
    expect(scheduleStartDate(MONTH_2, "2026-04-01")).toBe("2027-03-06");
    expect(scheduleStartDate(MONTH_24, "2026-04-01")).toBe("2029-01-06");
  });
});

describe("itemsAtStep", () => {
  it("lists the items whose window holds the step", () => {
    expect(ids(itemsAtStep(ITEMS, weekStep(24)))).toEqual(["weeks-20-32", "weeks-24-36"]);
  });

  it("leaves out an item whose window has not opened or has closed", () => {
    expect(ids(itemsAtStep(ITEMS, weekStep(34)))).toEqual(["weeks-24-36"]);
  });

  it("matches age 2 with a month 24 window", () => {
    expect(ids(itemsAtStep(ITEMS, ageStep(2)))).toEqual(["month-24"]);
  });

  it("is empty between windows", () => {
    expect(itemsAtStep(ITEMS, weekStep(10))).toEqual([]);
  });
});

describe("overdueItemsBeforeStep", () => {
  it("lists the items that closed before the step and are still open", () => {
    expect(ids(overdueItemsBeforeStep(ITEMS, monthStep(6), monthStep(6), {}))).toEqual([
      "weeks-20-32",
      "weeks-24-36",
      "month-0",
      "month-2",
    ]);
  });

  it("leaves out an item that is already recorded", () => {
    expect(ids(overdueItemsBeforeStep(ITEMS, monthStep(6), monthStep(6), { "month-0": DONE }))).toEqual([
      "weeks-20-32",
      "weeks-24-36",
      "month-2",
    ]);
  });

  it("leaves out an item that ends on the step itself", () => {
    expect(ids(overdueItemsBeforeStep([MONTH_2], monthStep(2), monthStep(6), {}))).toEqual([]);
  });

  it("leaves out an item that is not overdue at the current point", () => {
    expect(ids(overdueItemsBeforeStep(ITEMS, monthStep(24), monthStep(1), {}))).toEqual([
      "weeks-20-32",
      "weeks-24-36",
      "month-0",
    ]);
  });
});

describe("itemsNeedingAction", () => {
  it("lists due items before overdue ones", () => {
    expect(ids(itemsNeedingAction(ITEMS, weekStep(34), {}))).toEqual(["weeks-24-36", "weeks-20-32"]);
  });

  it("is empty before the first window", () => {
    expect(itemsNeedingAction(ITEMS, weekStep(5), {})).toEqual([]);
  });

  it("is empty when every item is recorded", () => {
    const record = Object.fromEntries(ITEMS.map((item) => [item.id, DONE]));
    expect(itemsNeedingAction(ITEMS, ageStep(3), record)).toEqual([]);
  });
});

describe("nextUpcomingItem", () => {
  it("is the first item still ahead", () => {
    expect(nextUpcomingItem(ITEMS, weekStep(22), {})?.id).toBe("weeks-24-36");
  });

  it("skips a recorded item", () => {
    expect(nextUpcomingItem(ITEMS, weekStep(22), { "weeks-24-36": DONE })?.id).toBe("month-0");
  });

  it("is undefined when everything left is due or overdue", () => {
    expect(nextUpcomingItem(ITEMS, ageStep(2), {})).toBeUndefined();
  });
});

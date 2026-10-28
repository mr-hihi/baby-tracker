import { describe, expect, it } from "vitest";
import { addDays, addMonths, calendarSpan, daysBetween, isIsoDate, toIsoDate } from "./date";

describe("isIsoDate", () => {
  it("accepts a real calendar date", () => {
    expect(isIsoDate("2024-02-29")).toBe(true);
  });

  it("rejects text that is not YYYY-MM-DD", () => {
    expect(isIsoDate("29/02/2024")).toBe(false);
  });

  it("rejects month 13", () => {
    expect(isIsoDate("2024-13-01")).toBe(false);
  });

  it("rejects month 00", () => {
    expect(isIsoDate("2024-00-10")).toBe(false);
  });

  it("rejects day 00", () => {
    expect(isIsoDate("2024-05-00")).toBe(false);
  });

  it("rejects Feb 29 in a non-leap year", () => {
    expect(isIsoDate("2025-02-29")).toBe(false);
  });
});

describe("toIsoDate", () => {
  it("formats the local calendar date with zero padding", () => {
    expect(toIsoDate(new Date(2026, 0, 5, 23, 30))).toBe("2026-01-05");
  });
});

describe("daysBetween", () => {
  it("counts days across a leap day", () => {
    expect(daysBetween("2024-02-28", "2024-03-01")).toBe(2);
  });

  it("is negative when the end is before the start", () => {
    expect(daysBetween("2024-03-01", "2024-02-28")).toBe(-2);
  });
});

describe("addDays", () => {
  it("rolls over the year end", () => {
    expect(addDays("2025-12-30", 3)).toBe("2026-01-02");
  });
});

describe("addMonths", () => {
  it("clamps to the last day of a shorter month", () => {
    expect(addMonths("2025-01-31", 1)).toBe("2025-02-28");
  });

  it("rolls into the next year", () => {
    expect(addMonths("2025-11-15", 3)).toBe("2026-02-15");
  });
});

describe("calendarSpan", () => {
  it("returns whole years, months and days", () => {
    expect(calendarSpan("2020-03-10", "2026-10-27")).toEqual({ years: 6, months: 7, days: 17 });
  });

  it("borrows a month when the day of month is not reached yet", () => {
    expect(calendarSpan("2025-01-31", "2025-03-01")).toEqual({ years: 0, months: 1, days: 1 });
  });

  it("treats Feb 28 as the anniversary of Feb 29 in a non-leap year", () => {
    expect(calendarSpan("2024-02-29", "2025-02-28")).toEqual({ years: 1, months: 0, days: 0 });
  });

  it("is all zeros on the same day", () => {
    expect(calendarSpan("2026-10-27", "2026-10-27")).toEqual({ years: 0, months: 0, days: 0 });
  });
});

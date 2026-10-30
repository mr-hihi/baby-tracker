import { describe, expect, it } from "vitest";
import { currentPointForProgress, estimatedBirthDate, growthProgress, stepForProgress, stepStartDate } from "./timeline";

describe("estimatedBirthDate", () => {
  it("is 280 days after the last period", () => {
    expect(estimatedBirthDate("2026-04-01")).toBe("2027-01-06");
  });
});

describe("growthProgress", () => {
  it("starts at 0 weeks 0 days on the last period date", () => {
    expect(growthProgress("2026-10-27", "2026-10-27")).toEqual({
      stage: "pregnancy",
      weeks: 0,
      days: 0,
      dueDate: "2027-08-03",
      daysUntilDue: 280,
    });
  });

  it("splits elapsed days into weeks and days", () => {
    expect(growthProgress("2026-04-01", "2026-10-27")).toMatchObject({
      stage: "pregnancy",
      weeks: 29,
      days: 6,
      daysUntilDue: 71,
    });
  });

  it("treats a last period date in the future as 0 weeks 0 days", () => {
    expect(growthProgress("2026-11-01", "2026-10-27")).toMatchObject({ stage: "pregnancy", weeks: 0, days: 0 });
  });

  it("is still pregnancy on day 280", () => {
    expect(growthProgress("2026-01-01", "2026-10-07")).toMatchObject({ stage: "pregnancy", weeks: 39, days: 6, daysUntilDue: 1 });
  });

  it("is born on the due date", () => {
    expect(growthProgress("2026-01-01", "2026-10-08")).toEqual({
      stage: "born",
      birthDate: "2026-10-08",
      age: { years: 0, months: 0, days: 0 },
      daysSinceBirth: 0,
    });
  });

  it("measures age from the estimated birth date", () => {
    expect(growthProgress("2020-01-01", "2026-10-27")).toMatchObject({
      stage: "born",
      birthDate: "2020-10-07",
      age: { years: 6, months: 0, days: 20 },
    });
  });
});

describe("stepForProgress", () => {
  it("shows week 1 during the first seven days", () => {
    expect(stepForProgress(growthProgress("2026-10-21", "2026-10-27"))).toEqual({ kind: "week", value: 1 });
  });

  it("shows week 40 in the last pregnancy week", () => {
    expect(stepForProgress(growthProgress("2026-01-01", "2026-10-07"))).toEqual({ kind: "week", value: 40 });
  });

  it("shows the completed years after birth", () => {
    expect(stepForProgress(growthProgress("2020-01-01", "2026-10-27"))).toEqual({ kind: "age", value: 6 });
  });

  it("caps the age at 18", () => {
    expect(stepForProgress(growthProgress("1990-01-01", "2026-10-27"))).toEqual({ kind: "age", value: 18 });
  });
});

describe("currentPointForProgress", () => {
  it("is the week being lived through while pregnant", () => {
    expect(currentPointForProgress(growthProgress("2026-04-01", "2026-10-27"))).toEqual({ kind: "week", value: 30 });
  });

  it("is month 0 on the due date", () => {
    expect(currentPointForProgress(growthProgress("2026-01-01", "2026-10-08"))).toEqual({ kind: "month", value: 0 });
  });

  it("is the completed months after birth", () => {
    expect(currentPointForProgress(growthProgress("2026-01-01", "2027-04-20"))).toEqual({ kind: "month", value: 6 });
  });

  it("is still month 24 at exactly two years", () => {
    expect(currentPointForProgress(growthProgress("2026-01-01", "2028-10-08"))).toEqual({ kind: "month", value: 24 });
  });

  it("switches to the age one month later", () => {
    expect(currentPointForProgress(growthProgress("2026-01-01", "2028-11-08"))).toEqual({ kind: "age", value: 2 });
  });

  it("shows the completed years for an older child", () => {
    expect(currentPointForProgress(growthProgress("2020-01-01", "2026-10-27"))).toEqual({ kind: "age", value: 6 });
  });

  it("caps the age at 18", () => {
    expect(currentPointForProgress(growthProgress("1990-01-01", "2026-10-27"))).toEqual({ kind: "age", value: 18 });
  });
});

describe("stepStartDate", () => {
  it("starts week 1 on the last period date", () => {
    expect(stepStartDate({ kind: "week", value: 1 }, "2026-04-01")).toBe("2026-04-01");
  });

  it("starts a later week seven days per week after", () => {
    expect(stepStartDate({ kind: "week", value: 12 }, "2026-04-01")).toBe("2026-06-17");
  });

  it("starts month 0 on the estimated birth date", () => {
    expect(stepStartDate({ kind: "month", value: 0 }, "2026-04-01")).toBe("2027-01-06");
  });

  it("starts a month after the birth date by whole months", () => {
    expect(stepStartDate({ kind: "month", value: 6 }, "2026-04-01")).toBe("2027-07-06");
  });

  it("starts an age at twelve months per year", () => {
    expect(stepStartDate({ kind: "age", value: 2 }, "2026-04-01")).toBe("2029-01-06");
  });
});

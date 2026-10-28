import { describe, expect, it } from "vitest";
import { estimatedBirthDate, growthProgress, stepForProgress } from "./timeline";

describe("estimatedBirthDate", () => {
  it("is 280 days after the last period", () => {
    expect(estimatedBirthDate("2026-04-01")).toBe("2027-01-06");
  });
});

describe("growthProgress", () => {
  it("starts on day 1, week 0 on the last period date", () => {
    expect(growthProgress("2026-10-27", "2026-10-27")).toEqual({
      stage: "pregnancy",
      dayOfPregnancy: 1,
      weeks: 0,
      days: 0,
      dueDate: "2027-08-03",
      daysUntilDue: 280,
    });
  });

  it("splits elapsed days into weeks and days", () => {
    expect(growthProgress("2026-04-01", "2026-10-27")).toMatchObject({
      stage: "pregnancy",
      dayOfPregnancy: 210,
      weeks: 29,
      days: 6,
      daysUntilDue: 71,
    });
  });

  it("treats a last period date in the future as day 1", () => {
    expect(growthProgress("2026-11-01", "2026-10-27")).toMatchObject({ stage: "pregnancy", dayOfPregnancy: 1 });
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

import { describe, expect, it } from "vitest";
import { validateDoseDate } from "./dose-date";

const LAST_PERIOD = "2026-04-01";
const TODAY = "2026-10-27";

describe("validateDoseDate", () => {
  it("accepts a date between the last period and today", () => {
    expect(validateDoseDate("2026-08-12", LAST_PERIOD, TODAY)).toEqual({ ok: true, date: "2026-08-12" });
  });

  it("accepts today and the last period date themselves", () => {
    expect(validateDoseDate(TODAY, LAST_PERIOD, TODAY)).toEqual({ ok: true, date: TODAY });
    expect(validateDoseDate(LAST_PERIOD, LAST_PERIOD, TODAY)).toEqual({ ok: true, date: LAST_PERIOD });
  });

  it("asks for a date when the input is empty", () => {
    expect(validateDoseDate("", LAST_PERIOD, TODAY)).toEqual({ ok: false, error: "dateRequired" });
  });

  it("asks for a date when the input is not a real date", () => {
    expect(validateDoseDate("2026-13-01", LAST_PERIOD, TODAY)).toEqual({ ok: false, error: "dateRequired" });
  });

  it("rejects a date after today", () => {
    expect(validateDoseDate("2026-10-28", LAST_PERIOD, TODAY)).toEqual({ ok: false, error: "dateInFuture" });
  });

  it("rejects a date before the last period", () => {
    expect(validateDoseDate("2026-03-31", LAST_PERIOD, TODAY)).toEqual({ ok: false, error: "dateBeforeLastPeriod" });
  });
});

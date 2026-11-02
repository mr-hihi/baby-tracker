import { describe, expect, it } from "vitest";
import { validateRecordDate } from "./record-date";

const LAST_PERIOD = "2026-04-01";
const TODAY = "2026-10-27";

describe("validateRecordDate", () => {
  it("accepts a date between the last period and today", () => {
    expect(validateRecordDate("2026-08-12", LAST_PERIOD, TODAY)).toEqual({ ok: true, date: "2026-08-12" });
  });

  it("accepts today and the last period date themselves", () => {
    expect(validateRecordDate(TODAY, LAST_PERIOD, TODAY)).toEqual({ ok: true, date: TODAY });
    expect(validateRecordDate(LAST_PERIOD, LAST_PERIOD, TODAY)).toEqual({ ok: true, date: LAST_PERIOD });
  });

  it("asks for a date when the input is empty", () => {
    expect(validateRecordDate("", LAST_PERIOD, TODAY)).toEqual({ ok: false, error: "dateRequired" });
  });

  it("asks for a date when the input is not a real date", () => {
    expect(validateRecordDate("2026-13-01", LAST_PERIOD, TODAY)).toEqual({ ok: false, error: "dateRequired" });
  });

  it("rejects a date after today", () => {
    expect(validateRecordDate("2026-10-28", LAST_PERIOD, TODAY)).toEqual({ ok: false, error: "dateInFuture" });
  });

  it("rejects a date before the last period", () => {
    expect(validateRecordDate("2026-03-31", LAST_PERIOD, TODAY)).toEqual({ ok: false, error: "dateBeforeLastPeriod" });
  });
});

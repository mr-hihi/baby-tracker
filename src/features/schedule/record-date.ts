import { isIsoDate, type IsoDate } from "@/lib/date";

export type RecordDateError = "dateRequired" | "dateInFuture" | "dateBeforeLastPeriod";

export type RecordDateResult = { ok: true; date: IsoDate } | { ok: false; error: RecordDateError };

export function validateRecordDate(input: string, lastPeriodDate: IsoDate, today: IsoDate): RecordDateResult {
  if (!isIsoDate(input)) return { ok: false, error: "dateRequired" };
  if (input > today) return { ok: false, error: "dateInFuture" };
  if (input < lastPeriodDate) return { ok: false, error: "dateBeforeLastPeriod" };
  return { ok: true, date: input };
}

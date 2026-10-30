import { isIsoDate, type IsoDate } from "@/lib/date";

export type DoseDateError = "dateRequired" | "dateInFuture" | "dateBeforeLastPeriod";

export type DoseDateResult = { ok: true; date: IsoDate } | { ok: false; error: DoseDateError };

export function validateDoseDate(input: string, lastPeriodDate: IsoDate, today: IsoDate): DoseDateResult {
  if (!isIsoDate(input)) return { ok: false, error: "dateRequired" };
  if (input > today) return { ok: false, error: "dateInFuture" };
  if (input < lastPeriodDate) return { ok: false, error: "dateBeforeLastPeriod" };
  return { ok: true, date: input };
}

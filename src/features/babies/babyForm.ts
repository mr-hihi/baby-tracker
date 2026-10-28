import type { Gender } from "@/features/growth/childhood-years";
import { isIsoDate, type IsoDate } from "@/lib/date";
import type { Baby } from "./babiesSlice";

export const NAME_MAX_LENGTH = 40;

export type BabyFormInput = { name: string; lastPeriodDate: string; gender: string };

export type BabyFormErrors = {
  name?: "nameRequired";
  lastPeriodDate?: "dateRequired" | "dateInFuture";
};

export type BabyFormResult = { ok: true; baby: Omit<Baby, "id"> } | { ok: false; errors: BabyFormErrors };

function toGender(value: string): Gender | undefined {
  return value === "boy" || value === "girl" ? value : undefined;
}

export function validateBabyForm(input: BabyFormInput, today: IsoDate): BabyFormResult {
  const name = input.name.trim().slice(0, NAME_MAX_LENGTH);
  const errors: BabyFormErrors = {};
  if (!name) errors.name = "nameRequired";
  if (!isIsoDate(input.lastPeriodDate)) errors.lastPeriodDate = "dateRequired";
  else if (input.lastPeriodDate > today) errors.lastPeriodDate = "dateInFuture";
  if (errors.name || errors.lastPeriodDate) return { ok: false, errors };
  const gender = toGender(input.gender);
  return { ok: true, baby: { name, lastPeriodDate: input.lastPeriodDate, ...(gender && { gender }) } };
}

export function createBabyId(): string {
  // randomUUID only exists in secure contexts (https, localhost) — not on a plain-http LAN address.
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

import type { Baby, SavedBabies } from "@/features/babies/babiesSlice";
import { isIsoDate, type IsoDate } from "@/lib/date";

export const BABIES_STORAGE_KEY = "baby-tracker:v1";

const EMPTY: SavedBabies = { items: [], selectedId: null };

function isBaby(value: unknown): value is Baby {
  if (typeof value !== "object" || value === null) return false;
  const baby = value as Record<string, unknown>;
  return (
    typeof baby.id === "string" &&
    typeof baby.name === "string" &&
    typeof baby.lastPeriodDate === "string" &&
    isIsoDate(baby.lastPeriodDate) &&
    (baby.gender === undefined || baby.gender === "boy" || baby.gender === "girl")
  );
}

function validRecordDates(stored: unknown): Record<string, IsoDate> | undefined {
  if (typeof stored !== "object" || stored === null || Array.isArray(stored)) return undefined;
  const valid = Object.entries(stored).filter(([, date]) => typeof date === "string" && isIsoDate(date));
  return valid.length > 0 ? Object.fromEntries(valid) : undefined;
}

function dropInvalidRecords(baby: Baby): Baby {
  const { vaccinations, prenatalTests, ...rest } = baby;
  const validVaccinations = validRecordDates(vaccinations);
  const validPrenatalTests = validRecordDates(prenatalTests);
  return {
    ...rest,
    ...(validVaccinations && { vaccinations: validVaccinations }),
    ...(validPrenatalTests && { prenatalTests: validPrenatalTests }),
  };
}

export function parseSavedBabies(raw: string | null): SavedBabies {
  if (!raw) return EMPTY;
  try {
    const data = JSON.parse(raw) as Partial<SavedBabies>;
    const items = Array.isArray(data.items) ? data.items.filter(isBaby).map(dropInvalidRecords) : [];
    const selectedId = typeof data.selectedId === "string" ? data.selectedId : null;
    return { items, selectedId };
  } catch {
    return EMPTY;
  }
}

export function readSavedBabies(storage: Storage = window.localStorage): SavedBabies {
  try {
    return parseSavedBabies(storage.getItem(BABIES_STORAGE_KEY));
  } catch {
    return EMPTY;
  }
}

export function writeSavedBabies(saved: SavedBabies, storage: Storage = window.localStorage): void {
  try {
    storage.setItem(BABIES_STORAGE_KEY, JSON.stringify(saved));
  } catch {}
}

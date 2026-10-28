import type { Baby, SavedBabies } from "@/features/babies/babiesSlice";
import { isIsoDate } from "@/lib/date";

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

export function parseSavedBabies(raw: string | null): SavedBabies {
  if (!raw) return EMPTY;
  try {
    const data = JSON.parse(raw) as Partial<SavedBabies>;
    const items = Array.isArray(data.items) ? data.items.filter(isBaby) : [];
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

import { describe, expect, it } from "vitest";
import { BABIES_STORAGE_KEY, parseSavedBabies, readSavedBabies, writeSavedBabies } from "./persistence";

function memoryStorage(initial: Record<string, string> = {}): Storage {
  const data = new Map(Object.entries(initial));
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => void data.delete(key),
    setItem: (key, value) => void data.set(key, value),
  };
}

function throwingStorage(): Storage {
  return {
    ...memoryStorage(),
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("quota");
    },
  };
}

const bong = { id: "a", name: "Bông", lastPeriodDate: "2026-04-01" };

describe("parseSavedBabies", () => {
  it("is empty when nothing is stored", () => {
    expect(parseSavedBabies(null)).toEqual({ items: [], selectedId: null });
  });

  it("is empty when the JSON is broken", () => {
    expect(parseSavedBabies("{oops")).toEqual({ items: [], selectedId: null });
  });

  it("keeps valid babies and drops malformed ones", () => {
    const raw = JSON.stringify({
      items: [bong, { id: "b", name: "Na", lastPeriodDate: "2026-13-01" }, { ...bong, id: "c", gender: "other" }, null],
      selectedId: "a",
    });
    expect(parseSavedBabies(raw)).toEqual({ items: [bong], selectedId: "a" });
  });

  it("keeps a valid gender", () => {
    const raw = JSON.stringify({ items: [{ ...bong, gender: "boy" }], selectedId: null });
    expect(parseSavedBabies(raw).items).toEqual([{ ...bong, gender: "boy" }]);
  });

  it("falls back when items is not a list and selectedId is not a string", () => {
    expect(parseSavedBabies(JSON.stringify({ items: "x", selectedId: 3 }))).toEqual({ items: [], selectedId: null });
  });
});

describe("readSavedBabies / writeSavedBabies", () => {
  it("round-trips through storage", () => {
    const storage = memoryStorage();
    writeSavedBabies({ items: [bong], selectedId: "a" }, storage);
    expect(readSavedBabies(storage)).toEqual({ items: [bong], selectedId: "a" });
  });

  it("reads the versioned key", () => {
    const storage = memoryStorage({ [BABIES_STORAGE_KEY]: JSON.stringify({ items: [bong], selectedId: null }) });
    expect(readSavedBabies(storage).items).toEqual([bong]);
  });

  it("is empty when storage access is blocked", () => {
    expect(readSavedBabies(throwingStorage())).toEqual({ items: [], selectedId: null });
  });

  it("does not throw when storage is full", () => {
    expect(() => writeSavedBabies({ items: [bong], selectedId: "a" }, throwingStorage())).not.toThrow();
  });
});

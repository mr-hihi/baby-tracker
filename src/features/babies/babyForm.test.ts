import { afterEach, describe, expect, it, vi } from "vitest";
import { createBabyId, validateBabyForm } from "./babyForm";

const TODAY = "2026-10-27";

describe("validateBabyForm", () => {
  it("accepts a trimmed name, a past date and a gender", () => {
    expect(validateBabyForm({ name: "  Bông ", lastPeriodDate: "2026-04-01", gender: "girl" }, TODAY)).toEqual({
      ok: true,
      baby: { name: "Bông", lastPeriodDate: "2026-04-01", gender: "girl" },
    });
  });

  it("leaves gender out when it is not chosen", () => {
    expect(validateBabyForm({ name: "Na", lastPeriodDate: TODAY, gender: "" }, TODAY)).toEqual({
      ok: true,
      baby: { name: "Na", lastPeriodDate: TODAY },
    });
  });

  it("cuts a long name to 40 characters", () => {
    const result = validateBabyForm({ name: "x".repeat(60), lastPeriodDate: TODAY, gender: "boy" }, TODAY);
    expect(result.ok && result.baby.name).toHaveLength(40);
  });

  it("requires a name and a date", () => {
    expect(validateBabyForm({ name: "   ", lastPeriodDate: "", gender: "" }, TODAY)).toEqual({
      ok: false,
      errors: { name: "nameRequired", lastPeriodDate: "dateRequired" },
    });
  });

  it("rejects a date in the future", () => {
    expect(validateBabyForm({ name: "Na", lastPeriodDate: "2026-10-28", gender: "" }, TODAY)).toEqual({
      ok: false,
      errors: { lastPeriodDate: "dateInFuture" },
    });
  });
});

describe("createBabyId", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses randomUUID when available", () => {
    vi.stubGlobal("crypto", { randomUUID: () => "uuid-1" });
    expect(createBabyId()).toBe("uuid-1");
  });

  it("falls back outside a secure context", () => {
    vi.stubGlobal("crypto", {});
    expect(createBabyId()).toMatch(/^[a-z0-9]+-[a-z0-9]+$/);
  });
});

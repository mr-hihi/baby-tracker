import { afterEach, describe, expect, it, vi } from "vitest";
import { isLocale } from "./locales";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("isLocale", () => {
  it("accepts a supported locale", () => {
    expect(isLocale("en")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});

describe("DEFAULT_LOCALE", () => {
  it("uses a supported env value", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_DEFAULT_LOCALE", "en");
    expect((await import("./locales")).DEFAULT_LOCALE).toBe("en");
  });

  it("falls back to vi for an unsupported env value", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_DEFAULT_LOCALE", "fr");
    expect((await import("./locales")).DEFAULT_LOCALE).toBe("vi");
  });
});

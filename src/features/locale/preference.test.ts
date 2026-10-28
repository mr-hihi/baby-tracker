import { afterEach, describe, expect, it, vi } from "vitest";
import { LOCALE_STORAGE_KEY } from "./locales";
import { preferredLocale, rememberLocale } from "./preference";

function stubBrowser({ saved, languages, broken }: { saved?: string; languages: string[]; broken?: boolean }) {
  const data = new Map<string, string>(saved ? [[LOCALE_STORAGE_KEY, saved]] : []);
  const localStorage = {
    getItem: (key: string) => {
      if (broken) throw new Error("blocked");
      return data.get(key) ?? null;
    },
    setItem: (key: string, value: string) => {
      if (broken) throw new Error("blocked");
      data.set(key, value);
    },
  };
  vi.stubGlobal("window", { localStorage });
  vi.stubGlobal("navigator", { languages });
  return data;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("preferredLocale", () => {
  it("uses the saved choice first", () => {
    stubBrowser({ saved: "en", languages: ["vi-VN"] });
    expect(preferredLocale()).toBe("en");
  });

  it("ignores an unsupported saved value and uses the browser language", () => {
    stubBrowser({ saved: "fr", languages: ["fr-FR", "EN-us"] });
    expect(preferredLocale()).toBe("en");
  });

  it("falls back to the default locale", () => {
    stubBrowser({ languages: ["ja-JP"] });
    expect(preferredLocale()).toBe("vi");
  });

  it("survives blocked storage", () => {
    stubBrowser({ languages: ["vi"], broken: true });
    expect(preferredLocale()).toBe("vi");
  });
});

describe("rememberLocale", () => {
  it("saves the choice", () => {
    const data = stubBrowser({ languages: [] });
    rememberLocale("en");
    expect(data.get(LOCALE_STORAGE_KEY)).toBe("en");
  });

  it("does not throw when storage is blocked", () => {
    stubBrowser({ languages: [], broken: true });
    expect(() => rememberLocale("vi")).not.toThrow();
  });
});

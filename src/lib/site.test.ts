import { afterEach, describe, expect, it, vi } from "vitest";

async function loadSite(env: Record<string, string | undefined>) {
  vi.resetModules();
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value as string);
  return import("./site");
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("site URLs", () => {
  it("joins the site URL without a double slash", async () => {
    const site = await loadSite({ NEXT_PUBLIC_SITE_URL: "https://mr-hihi.github.io/baby-tracker/" });
    expect(site.absoluteUrl("/vi/")).toBe("https://mr-hihi.github.io/baby-tracker/vi/");
  });

  it("falls back to the local dev URL", async () => {
    const site = await loadSite({ NEXT_PUBLIC_SITE_URL: undefined });
    expect(site.SITE_URL).toBe("http://localhost:4071");
  });

  it("prefixes asset paths with the base path", async () => {
    const site = await loadSite({ NEXT_PUBLIC_BASE_PATH: "/baby-tracker" });
    expect(site.withBasePath("/assets/size/lime.svg")).toBe("/baby-tracker/assets/size/lime.svg");
  });

  it("leaves asset paths alone without a base path", async () => {
    const site = await loadSite({ NEXT_PUBLIC_BASE_PATH: undefined });
    expect(site.withBasePath("/og-image.png")).toBe("/og-image.png");
  });
});

describe("paths", () => {
  it("builds locale, week and age paths", async () => {
    const site = await loadSite({});
    expect(site.localePath("en")).toBe("/en/");
    expect(site.localePath("vi", site.weekPath(12))).toBe("/vi/week/12/");
    expect(site.localePath("vi", site.agePath(0))).toBe("/vi/age/0/");
  });
});

describe("monthPath / stepPath", () => {
  it("builds the month path", async () => {
    const site = await loadSite({});
    expect(site.monthPath(6)).toBe("month/6/");
  });

  it("builds the path of every step kind", async () => {
    const site = await loadSite({});
    expect(site.stepPath({ kind: "week", value: 12 })).toBe("week/12/");
    expect(site.stepPath({ kind: "month", value: 6 })).toBe("month/6/");
    expect(site.stepPath({ kind: "age", value: 3 })).toBe("age/3/");
  });

  it("exposes the vaccines path", async () => {
    const site = await loadSite({});
    expect(site.localePath("vi", site.VACCINES_PATH)).toBe("/vi/vaccines/");
  });
});

describe("languageAlternates", () => {
  it("points x-default at the chooser for the home page", async () => {
    const site = await loadSite({ NEXT_PUBLIC_SITE_URL: "https://x.io" });
    expect(site.languageAlternates()).toEqual({
      vi: "https://x.io/vi/",
      en: "https://x.io/en/",
      "x-default": "https://x.io/",
    });
  });

  it("points x-default at the default locale for a deep page", async () => {
    const site = await loadSite({ NEXT_PUBLIC_SITE_URL: "https://x.io", NEXT_PUBLIC_DEFAULT_LOCALE: "en" });
    expect(site.languageAlternates("week/3/")["x-default"]).toBe("https://x.io/en/week/3/");
  });
});

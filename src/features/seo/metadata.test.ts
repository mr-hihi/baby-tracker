import { describe, expect, it } from "vitest";
import { SITE_URL } from "@/lib/site";
import { breadcrumbLd, pageMetadata, webApplicationLd } from "./metadata";

describe("pageMetadata", () => {
  it("builds canonical, hreflang and Open Graph for a page", () => {
    const metadata = pageMetadata({ locale: "en", path: "week/5/", title: "Week 5", description: "d" });
    expect(metadata.title).toBe("Week 5");
    expect(metadata.alternates).toEqual({
      canonical: `${SITE_URL}/en/week/5/`,
      languages: { vi: `${SITE_URL}/vi/week/5/`, en: `${SITE_URL}/en/week/5/`, "x-default": `${SITE_URL}/vi/week/5/` },
    });
    expect(metadata.openGraph).toMatchObject({
      url: `${SITE_URL}/en/week/5/`,
      locale: "en_US",
      alternateLocale: ["vi_VN"],
      siteName: "Baby Day by Day",
    });
  });

  it("keeps an absolute title out of the layout template", () => {
    expect(pageMetadata({ locale: "vi", path: "", title: "Home", description: "d", absoluteTitle: true }).title).toEqual({
      absolute: "Home",
    });
  });
});

describe("structured data", () => {
  it("describes the app in the page language", () => {
    expect(webApplicationLd("vi")).toMatchObject({ "@type": "WebApplication", inLanguage: "vi", url: `${SITE_URL}/vi/` });
  });

  it("numbers breadcrumb items from 1", () => {
    expect(breadcrumbLd([{ name: "Home", path: "/en/" }, { name: "Week 5", path: "/en/week/5/" }])).toMatchObject({
      itemListElement: [
        { position: 1, name: "Home", item: `${SITE_URL}/en/` },
        { position: 2, name: "Week 5", item: `${SITE_URL}/en/week/5/` },
      ],
    });
  });
});

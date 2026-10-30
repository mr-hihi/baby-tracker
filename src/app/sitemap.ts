import type { MetadataRoute } from "next";
import { MAX_AGE, MAX_MONTH, PREGNANCY_WEEKS } from "@/features/growth/steps";
import { LOCALES } from "@/features/locale/locales";
import { absoluteUrl, agePath, languageAlternates, localePath, monthPath, VACCINES_PATH, weekPath } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    ...Array.from({ length: PREGNANCY_WEEKS }, (_, i) => weekPath(i + 1)),
    ...Array.from({ length: MAX_MONTH + 1 }, (_, i) => monthPath(i)),
    ...Array.from({ length: MAX_AGE + 1 }, (_, i) => agePath(i)),
    VACCINES_PATH,
  ];
  return paths.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(localePath(locale, path)),
      changeFrequency: "monthly" as const,
      priority: path ? 0.7 : 1,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}

import type { Metadata } from "next";
import { getDictionary } from "@/features/locale/dictionaries";
import { LOCALES, type Locale } from "@/features/locale/locales";
import { absoluteUrl, languageAlternates, localePath, OG_IMAGE_PATH } from "@/lib/site";

const OG_LOCALES: Record<Locale, string> = { vi: "vi_VN", en: "en_US" };

type PageMetadataInput = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
};

export function pageMetadata({ locale, path, title, description, absoluteTitle }: PageMetadataInput): Metadata {
  const dict = getDictionary(locale);
  const url = absoluteUrl(localePath(locale, path));
  const image = { url: absoluteUrl(OG_IMAGE_PATH), width: 1200, height: 630, alt: dict.appName };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: dict.appName,
      locale: OG_LOCALES[locale],
      alternateLocale: LOCALES.filter((other) => other !== locale).map((other) => OG_LOCALES[other]),
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

export function webApplicationLd(locale: Locale): Record<string, unknown> {
  const dict = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: dict.appName,
    description: dict.meta.homeDescription,
    url: absoluteUrl(localePath(locale)),
    inLanguage: locale,
    applicationCategory: "HealthApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

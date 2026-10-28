# Template: Page

`src/app/[locale]/<section>/[item]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/atoms/JsonLd";
import { PageShell } from "@/components/templates/PageShell";
import { getDictionary } from "@/features/locale/dictionaries";
import { isLocale } from "@/features/locale/locales";
import { breadcrumbLd, pageMetadata } from "@/features/seo/metadata";
import { localePath } from "@/lib/site";

const ITEMS = ["a", "b"] as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return ITEMS.map((item) => ({ item }));
}

async function resolve(params: PageProps<"/[locale]/section/[item]">["params"]) {
  const { locale, item } = await params;
  if (!isLocale(locale) || !ITEMS.includes(item as (typeof ITEMS)[number])) notFound();
  return { locale, item };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/section/[item]">): Promise<Metadata> {
  const { locale, item } = await resolve(params);
  const dict = getDictionary(locale);
  return pageMetadata({ locale, path: `section/${item}/`, title: dict.appName, description: dict.tagline });
}

export default async function SectionItemPage({ params }: PageProps<"/[locale]/section/[item]">) {
  const { locale, item } = await resolve(params);
  const dict = getDictionary(locale);
  return (
    <PageShell disclaimer={dict.disclaimer}>
      <h1 className="text-2xl font-extrabold">{item}</h1>
      <JsonLd
        data={breadcrumbLd([
          { name: dict.guide.breadcrumbHome, path: localePath(locale) },
          { name: item, path: localePath(locale, `section/${item}/`) },
        ])}
      />
    </PageShell>
  );
}
```

- `PageProps<"/[locale]/section/[item]">` type-checks only after the file exists and `npx next typegen` has run.
- Then add the locale-less path `section/<item>/` to `paths` in `src/app/sitemap.ts`.

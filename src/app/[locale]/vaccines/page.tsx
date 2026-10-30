import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/atoms/JsonLd";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { VaccineSchedule } from "@/components/organisms/VaccineSchedule";
import { PageShell } from "@/components/templates/PageShell";
import { getDictionary } from "@/features/locale/dictionaries";
import { isLocale } from "@/features/locale/locales";
import { breadcrumbLd, pageMetadata } from "@/features/seo/metadata";
import { localePath, VACCINES_PATH } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/vaccines">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: VACCINES_PATH,
    title: dict.meta.vaccinesTitle,
    description: dict.meta.vaccinesDescription,
  });
}

export default async function VaccinesPage({ params }: PageProps<"/[locale]/vaccines">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const heading = dict.vaccination.scheduleHeading;
  const crumbs = [
    { name: dict.guide.breadcrumbHome, path: localePath(locale) },
    { name: heading, path: localePath(locale, VACCINES_PATH) },
  ];

  return (
    <PageShell disclaimer={dict.disclaimer}>
      <Breadcrumbs
        label={dict.guide.breadcrumbHome}
        items={crumbs.map((crumb, index) => ({
          label: crumb.name,
          href: index < crumbs.length - 1 ? crumb.path : undefined,
        }))}
      />
      <h1 className="mt-2 mb-1 text-2xl font-extrabold">{heading}</h1>
      <p className="mb-6 text-sm text-muted">{dict.vaccination.source}</p>
      <VaccineSchedule />
      <JsonLd data={breadcrumbLd(crumbs)} />
    </PageShell>
  );
}

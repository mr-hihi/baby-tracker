import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/atoms/JsonLd";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { PrenatalTestSchedule } from "@/components/organisms/PrenatalTestSchedule";
import { PageShell } from "@/components/templates/PageShell";
import { getDictionary } from "@/features/locale/dictionaries";
import { isLocale } from "@/features/locale/locales";
import { breadcrumbLd, pageMetadata } from "@/features/seo/metadata";
import { localePath, PRENATAL_TESTS_PATH } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/prenatal-tests">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: PRENATAL_TESTS_PATH,
    title: dict.meta.prenatalTestsTitle,
    description: dict.meta.prenatalTestsDescription,
  });
}

export default async function PrenatalTestsPage({ params }: PageProps<"/[locale]/prenatal-tests">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const heading = dict.prenatalTest.scheduleHeading;
  const crumbs = [
    { name: dict.guide.breadcrumbHome, path: localePath(locale) },
    { name: heading, path: localePath(locale, PRENATAL_TESTS_PATH) },
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
      <p className="mb-6 text-sm text-muted">{dict.prenatalTest.source}</p>
      <PrenatalTestSchedule />
      <JsonLd data={breadcrumbLd(crumbs)} />
    </PageShell>
  );
}

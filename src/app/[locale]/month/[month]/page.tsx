import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonClass } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { JsonLd } from "@/components/atoms/JsonLd";
import { AgeComparison } from "@/components/molecules/AgeComparison";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { CareSection } from "@/components/organisms/CareSection";
import { GrowthCard } from "@/components/organisms/GrowthCard";
import { JourneyIndex } from "@/components/organisms/JourneyIndex";
import { VaccineSection } from "@/components/organisms/VaccineSection";
import { PageShell } from "@/components/templates/PageShell";
import { monthBodySize } from "@/features/growth/infant-months";
import { MAX_MONTH, monthStep, type GrowthStep } from "@/features/growth/steps";
import { getDictionary } from "@/features/locale/dictionaries";
import { fill, formatLength } from "@/features/locale/format";
import { isLocale } from "@/features/locale/locales";
import { breadcrumbLd, pageMetadata } from "@/features/seo/metadata";
import { localePath, monthPath, stepPath } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: MAX_MONTH + 1 }, (_, i) => ({ month: String(i) }));
}

async function resolve(params: PageProps<"/[locale]/month/[month]">["params"]) {
  const { locale, month } = await params;
  const value = Number(month);
  if (!isLocale(locale) || !Number.isInteger(value) || value < 0 || value > MAX_MONTH) notFound();
  return { locale, month: value };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/month/[month]">): Promise<Metadata> {
  const { locale, month } = await resolve(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: monthPath(month),
    title: fill(dict.meta.monthTitle, { month }),
    description: fill(dict.meta.monthDescription, {
      month,
      boySize: formatLength(monthBodySize(month, "boy").heightCm, locale),
      girlSize: formatLength(monthBodySize(month, "girl").heightCm, locale),
    }),
  });
}

export default async function MonthPage({ params }: PageProps<"/[locale]/month/[month]">) {
  const { locale, month } = await resolve(params);
  const dict = getDictionary(locale);
  const step = monthStep(month);
  const heading = fill(dict.guide.monthHeading, { month });
  const hrefFor = (target: GrowthStep) => localePath(locale, stepPath(target));
  const crumbs = [
    { name: dict.guide.breadcrumbHome, path: localePath(locale) },
    { name: dict.guide.breadcrumbMonths, path: localePath(locale, monthPath(0)) },
    { name: heading, path: localePath(locale, monthPath(month)) },
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
      <h1 className="mt-2 mb-5 text-2xl font-extrabold">{heading}</h1>
      <GrowthCard step={step} locale={locale} navigation={{ mode: "link", hrefFor }} preloadImage />
      <div className="mt-6">
        <AgeComparison step={step} locale={locale} dict={dict} />
      </div>
      <CareSection step={step} dict={dict} />
      <VaccineSection step={step} />
      <div className="mt-6 flex justify-center">
        <Link href={localePath(locale)} className={buttonClass("primary")}>
          {dict.guide.trackCta}
          <Icon name="arrowRight" className="size-4" />
        </Link>
      </div>
      <JourneyIndex locale={locale} dict={dict} />
      <JsonLd data={breadcrumbLd(crumbs)} />
    </PageShell>
  );
}

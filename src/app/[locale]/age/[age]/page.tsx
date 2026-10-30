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
import { MonthLinks } from "@/components/organisms/MonthLinks";
import { VaccineSection } from "@/components/organisms/VaccineSection";
import { PageShell } from "@/components/templates/PageShell";
import { bodySize } from "@/features/growth/childhood-years";
import { ageStep, MAX_AGE, monthsInAge, type GrowthStep } from "@/features/growth/steps";
import { getDictionary } from "@/features/locale/dictionaries";
import { fill, formatLength } from "@/features/locale/format";
import { isLocale } from "@/features/locale/locales";
import { breadcrumbLd, pageMetadata } from "@/features/seo/metadata";
import { agePath, localePath, stepPath } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: MAX_AGE + 1 }, (_, i) => ({ age: String(i) }));
}

async function resolve(params: PageProps<"/[locale]/age/[age]">["params"]) {
  const { locale, age } = await params;
  const value = Number(age);
  if (!isLocale(locale) || !Number.isInteger(value) || value < 0 || value > MAX_AGE) notFound();
  return { locale, age: value };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/age/[age]">): Promise<Metadata> {
  const { locale, age } = await resolve(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: agePath(age),
    title: fill(dict.meta.ageTitle, { age }),
    description: fill(dict.meta.ageDescription, {
      age,
      milestone: dict.ageMilestones[age],
      boyHeight: formatLength(bodySize(age, "boy").heightCm, locale),
      girlHeight: formatLength(bodySize(age, "girl").heightCm, locale),
    }),
  });
}

export default async function AgePage({ params }: PageProps<"/[locale]/age/[age]">) {
  const { locale, age } = await resolve(params);
  const dict = getDictionary(locale);
  const step = ageStep(age);
  const months = monthsInAge(age);
  const heading = fill(dict.guide.ageHeading, { age });
  const hrefFor = (target: GrowthStep) => localePath(locale, stepPath(target));
  const crumbs = [
    { name: dict.guide.breadcrumbHome, path: localePath(locale) },
    { name: dict.guide.breadcrumbAges, path: localePath(locale, agePath(0)) },
    { name: heading, path: localePath(locale, agePath(age)) },
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
      <p className="mb-5 text-muted">{dict.ageMilestones[age]}</p>
      <GrowthCard step={step} locale={locale} navigation={{ mode: "link", hrefFor }} preloadImage />
      <div className="mt-6">
        <AgeComparison step={step} locale={locale} dict={dict} />
      </div>
      {months.length > 0 ? (
        <div className="mt-6">
          <MonthLinks id="age-months" months={months} locale={locale} dict={dict} />
        </div>
      ) : (
        <>
          <CareSection step={step} dict={dict} />
          <VaccineSection step={step} />
        </>
      )}
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

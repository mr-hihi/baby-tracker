import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonClass } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { JsonLd } from "@/components/atoms/JsonLd";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { GrowthCard } from "@/components/organisms/GrowthCard";
import { JourneyIndex } from "@/components/organisms/JourneyIndex";
import { PageShell } from "@/components/templates/PageShell";
import { weekFacts } from "@/features/growth/pregnancy-weeks";
import { PREGNANCY_WEEKS, weekStep, type GrowthStep } from "@/features/growth/steps";
import { getDictionary } from "@/features/locale/dictionaries";
import { fill } from "@/features/locale/format";
import { isLocale, type Locale } from "@/features/locale/locales";
import { breadcrumbLd, pageMetadata } from "@/features/seo/metadata";
import { agePath, localePath, weekPath } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: PREGNANCY_WEEKS }, (_, i) => ({ week: String(i + 1) }));
}

async function resolve(params: PageProps<"/[locale]/week/[week]">["params"]) {
  const { locale, week } = await params;
  const value = Number(week);
  if (!isLocale(locale) || !Number.isInteger(value) || value < 1 || value > PREGNANCY_WEEKS) notFound();
  return { locale, week: value };
}

function weekTitle(locale: Locale, week: number): string {
  const dict = getDictionary(locale);
  const { fruit } = weekFacts(week);
  return fruit
    ? fill(dict.meta.weekTitle, { week, fruit: dict.fruits[fruit] })
    : fill(dict.meta.weekTitlePlain, { week });
}

export async function generateMetadata({ params }: PageProps<"/[locale]/week/[week]">): Promise<Metadata> {
  const { locale, week } = await resolve(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: weekPath(week),
    title: weekTitle(locale, week),
    description: fill(dict.meta.weekDescription, { week, note: dict.weekNotes[week - 1] }),
  });
}

export default async function WeekPage({ params }: PageProps<"/[locale]/week/[week]">) {
  const { locale, week } = await resolve(params);
  const dict = getDictionary(locale);
  const heading = fill(dict.guide.weekHeading, { week });
  const hrefFor = (step: GrowthStep) =>
    localePath(locale, step.kind === "week" ? weekPath(step.value) : agePath(step.value));
  const crumbs = [
    { name: dict.guide.breadcrumbHome, path: localePath(locale) },
    { name: dict.guide.breadcrumbWeeks, path: localePath(locale, weekPath(1)) },
    { name: heading, path: localePath(locale, weekPath(week)) },
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
      <p className="mb-5 text-muted">{weekTitle(locale, week)}</p>
      <GrowthCard step={weekStep(week)} locale={locale} navigation={{ mode: "link", hrefFor }} preloadImage />
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

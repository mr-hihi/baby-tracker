import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/atoms/JsonLd";
import { BabyDashboard } from "@/components/organisms/BabyDashboard";
import { JourneyIndex } from "@/components/organisms/JourneyIndex";
import { PageShell } from "@/components/templates/PageShell";
import { getDictionary } from "@/features/locale/dictionaries";
import { isLocale } from "@/features/locale/locales";
import { pageMetadata, webApplicationLd } from "@/features/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: "",
    title: dict.meta.homeTitle,
    description: dict.meta.homeDescription,
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return (
    <PageShell disclaimer={dict.disclaimer}>
      <BabyDashboard />
      <section className="mt-12 px-1">
        <h1 className="text-2xl font-extrabold">{dict.journey.heading}</h1>
        <p className="mt-2 leading-relaxed text-muted">{dict.journey.intro}</p>
      </section>
      <JourneyIndex locale={locale} dict={dict} />
      <JsonLd data={webApplicationLd(locale)} />
    </PageShell>
  );
}

import { StepLinkGrid } from "@/components/molecules/StepLinkGrid";
import type { Dictionary } from "@/features/locale/dictionaries";
import { fill } from "@/features/locale/format";
import type { Locale } from "@/features/locale/locales";
import { localePath, monthPath } from "@/lib/site";

export function MonthLinks({ id, months, locale, dict }: {
  id: string;
  months: number[];
  locale: Locale;
  dict: Dictionary;
}) {
  const links = months.map((month) => ({
    href: localePath(locale, monthPath(month)),
    label: fill(dict.journey.monthLink, { n: month }),
    text: month,
  }));
  return <StepLinkGrid id={id} heading={dict.journey.monthsHeading} links={links} />;
}

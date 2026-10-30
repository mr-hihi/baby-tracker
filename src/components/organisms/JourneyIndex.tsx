import { StepLinkGrid } from "@/components/molecules/StepLinkGrid";
import { MAX_AGE, MAX_MONTH, PREGNANCY_WEEKS } from "@/features/growth/steps";
import type { Dictionary } from "@/features/locale/dictionaries";
import { fill } from "@/features/locale/format";
import type { Locale } from "@/features/locale/locales";
import { agePath, localePath, weekPath } from "@/lib/site";
import { MonthLinks } from "./MonthLinks";

const WEEKS = Array.from({ length: PREGNANCY_WEEKS }, (_, i) => i + 1);
const MONTHS = Array.from({ length: MAX_MONTH + 1 }, (_, i) => i);
const AGES = Array.from({ length: MAX_AGE + 1 }, (_, i) => i);

export function JourneyIndex({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const weekLinks = WEEKS.map((week) => ({
    href: localePath(locale, weekPath(week)),
    label: fill(dict.journey.weekLink, { n: week }),
    text: week,
  }));
  const ageLinks = AGES.map((age) => ({
    href: localePath(locale, agePath(age)),
    label: fill(dict.journey.ageLink, { n: age }),
    text: age,
  }));
  return (
    <div className="mt-8 flex flex-col gap-8">
      <StepLinkGrid id="journey-weeks" heading={dict.journey.weeksHeading} links={weekLinks} />
      <MonthLinks id="journey-months" months={MONTHS} locale={locale} dict={dict} />
      <StepLinkGrid id="journey-ages" heading={dict.journey.agesHeading} links={ageLinks} />
    </div>
  );
}

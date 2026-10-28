import Link from "next/link";
import { MAX_AGE, PREGNANCY_WEEKS } from "@/features/growth/steps";
import type { Dictionary } from "@/features/locale/dictionaries";
import { fill } from "@/features/locale/format";
import type { Locale } from "@/features/locale/locales";
import { agePath, localePath, weekPath } from "@/lib/site";

const PILL =
  "grid h-10 place-items-center rounded-xl bg-surface text-sm font-bold text-ink shadow-sm transition-colors hover:bg-brand hover:text-white";

const WEEKS = Array.from({ length: PREGNANCY_WEEKS }, (_, i) => i + 1);
const AGES = Array.from({ length: MAX_AGE + 1 }, (_, i) => i);

export function JourneyIndex({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <div className="mt-8 flex flex-col gap-8">
      <section aria-labelledby="journey-weeks">
        <h2 id="journey-weeks" className="mb-3 text-lg font-extrabold">
          {dict.journey.weeksHeading}
        </h2>
        <ul className="grid grid-cols-8 gap-1.5">
          {WEEKS.map((week) => (
            <li key={week}>
              <Link
                href={localePath(locale, weekPath(week))}
                aria-label={fill(dict.journey.weekLink, { n: week })}
                className={PILL}
              >
                {week}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="journey-ages">
        <h2 id="journey-ages" className="mb-3 text-lg font-extrabold">
          {dict.journey.agesHeading}
        </h2>
        <ul className="grid grid-cols-8 gap-1.5">
          {AGES.map((age) => (
            <li key={age}>
              <Link
                href={localePath(locale, agePath(age))}
                aria-label={fill(dict.journey.ageLink, { n: age })}
                className={PILL}
              >
                {age}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

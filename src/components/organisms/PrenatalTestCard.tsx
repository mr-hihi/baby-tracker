"use client";

import { ScheduleCard } from "@/components/molecules/ScheduleCard";
import { TestRow } from "@/components/molecules/TestRow";
import type { Baby } from "@/features/babies/babiesSlice";
import type { GrowthStep } from "@/features/growth/steps";
import { useLocale } from "@/features/locale/LocaleProvider";
import { fill, formatIsoDate } from "@/features/locale/format";
import { nextUpcomingTest, testsNeedingAction } from "@/features/prenatal-tests/test-status";
import { scheduleStartDate } from "@/features/schedule/schedule-status";
import type { IsoDate } from "@/lib/date";
import { localePath, PRENATAL_TESTS_PATH } from "@/lib/site";
import { TestRecordControl } from "./TestRecordControl";

function NothingDueMessage({ baby, point }: { baby: Baby; point: GrowthStep }) {
  const { locale, dict } = useLocale();
  const next = nextUpcomingTest(point, baby.prenatalTests ?? {});
  if (!next) return <p className="mt-3 text-sm text-muted">{dict.prenatalTest.allDone}</p>;
  return (
    <p className="mt-3 text-sm text-muted">
      {fill(dict.prenatalTest.nextTest, {
        test: dict.prenatalTestTexts[next.id].name,
        date: formatIsoDate(scheduleStartDate(next, baby.lastPeriodDate), locale),
      })}
    </p>
  );
}

export function PrenatalTestCard({ baby, point, today }: { baby: Baby; point: GrowthStep; today: IsoDate }) {
  const { locale, dict } = useLocale();
  const tests = testsNeedingAction(point, baby.prenatalTests ?? {});
  return (
    <ScheduleCard
      headingId="prenatal-test-card-heading"
      heading={dict.prenatalTest.heading}
      scheduleHref={localePath(locale, PRENATAL_TESTS_PATH)}
      scheduleLabel={dict.prenatalTest.fullSchedule}
    >
      {tests.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-2">
          {tests.map((test) => (
            <TestRow key={test.id} test={test} dict={dict}>
              <TestRecordControl baby={baby} test={test} point={point} today={today} />
            </TestRow>
          ))}
        </ul>
      ) : (
        <NothingDueMessage baby={baby} point={point} />
      )}
    </ScheduleCard>
  );
}

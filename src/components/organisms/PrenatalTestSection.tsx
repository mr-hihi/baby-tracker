"use client";

import { useState, type ReactNode } from "react";
import { ScheduleCard } from "@/components/molecules/ScheduleCard";
import { TestRow } from "@/components/molecules/TestRow";
import { selectBabiesLoaded, selectSelectedBaby, type Baby } from "@/features/babies/babiesSlice";
import { currentPointForProgress, growthProgress } from "@/features/growth/timeline";
import { useLocale } from "@/features/locale/LocaleProvider";
import { fill } from "@/features/locale/format";
import type { PrenatalTest } from "@/features/prenatal-tests/prenatal-tests";
import { overdueTestsBeforeWeek, testsAtWeek } from "@/features/prenatal-tests/test-status";
import { todayIso } from "@/lib/date";
import { localePath, PRENATAL_TESTS_PATH } from "@/lib/site";
import { useAppSelector } from "@/store/hooks";
import { TestRecordControl } from "./TestRecordControl";

function SectionFrame({ heading, children }: { heading: string; children: ReactNode }) {
  const { locale, dict } = useLocale();
  return (
    <ScheduleCard
      headingId="prenatal-tests-heading"
      heading={heading}
      scheduleHref={localePath(locale, PRENATAL_TESTS_PATH)}
      scheduleLabel={dict.prenatalTest.fullSchedule}
    >
      {children}
    </ScheduleCard>
  );
}

function TestList({ id, title, tests, controlFor }: {
  id: string;
  title: string;
  tests: PrenatalTest[];
  controlFor?: (test: PrenatalTest) => ReactNode;
}) {
  const { dict } = useLocale();
  if (tests.length === 0) return null;
  return (
    <section aria-labelledby={id} className="py-3 last:pb-0">
      <h3 id={id} className="text-sm font-bold text-muted">
        {title}
      </h3>
      <ul className="mt-1.5 flex flex-col gap-1.5">
        {tests.map((test) => (
          <TestRow key={test.id} test={test} dict={dict}>
            {controlFor?.(test)}
          </TestRow>
        ))}
      </ul>
    </section>
  );
}

function BabyTestSection({ week, baby }: { week: number; baby: Baby }) {
  const { dict } = useLocale();
  const [today] = useState(todayIso);
  const point = currentPointForProgress(growthProgress(baby.lastPeriodDate, today));
  const atWeek = testsAtWeek(week);
  const overdue = overdueTestsBeforeWeek(week, point, baby.prenatalTests ?? {});
  if (atWeek.length === 0 && overdue.length === 0) return null;
  const controlFor = (test: PrenatalTest) => <TestRecordControl baby={baby} test={test} point={point} today={today} />;
  return (
    <SectionFrame heading={fill(dict.prenatalTest.headingForBaby, { name: baby.name })}>
      <TestList id="prenatal-tests-at-step" title={dict.prenatalTest.atStep} tests={atWeek} controlFor={controlFor} />
      <TestList id="prenatal-tests-overdue" title={dict.prenatalTest.notYetDone} tests={overdue} controlFor={controlFor} />
    </SectionFrame>
  );
}

export function PrenatalTestSection({ week }: { week: number }) {
  const { dict } = useLocale();
  const loaded = useAppSelector(selectBabiesLoaded);
  const baby = useAppSelector(selectSelectedBaby);
  if (loaded && baby) return <BabyTestSection key={baby.id} week={week} baby={baby} />;
  const atWeek = testsAtWeek(week);
  if (atWeek.length === 0) return null;
  return (
    <SectionFrame heading={dict.prenatalTest.heading}>
      <TestList id="prenatal-tests-at-step" title={dict.prenatalTest.atStep} tests={atWeek} />
    </SectionFrame>
  );
}

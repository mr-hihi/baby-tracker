"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { buttonClass } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { TestRow } from "@/components/molecules/TestRow";
import { selectBabiesLoaded, selectSelectedBaby, type Baby } from "@/features/babies/babiesSlice";
import { currentPointForProgress, growthProgress } from "@/features/growth/timeline";
import { useLocale } from "@/features/locale/LocaleProvider";
import { fill } from "@/features/locale/format";
import { PRENATAL_TESTS, type PrenatalTest } from "@/features/prenatal-tests/prenatal-tests";
import { todayIso } from "@/lib/date";
import { localePath } from "@/lib/site";
import { useAppSelector } from "@/store/hooks";
import { TestRecordControl } from "./TestRecordControl";

function TestList({ controlFor }: { controlFor?: (test: PrenatalTest) => ReactNode }) {
  const { dict } = useLocale();
  return (
    <ul className="flex flex-col gap-2">
      {PRENATAL_TESTS.map((test) => (
        <TestRow key={test.id} test={test} dict={dict}>
          {controlFor?.(test)}
        </TestRow>
      ))}
    </ul>
  );
}

function BabySchedule({ baby }: { baby: Baby }) {
  const { dict } = useLocale();
  const [today] = useState(todayIso);
  const point = currentPointForProgress(growthProgress(baby.lastPeriodDate, today));
  return (
    <>
      <p className="mb-4 text-lg font-extrabold text-brand-strong">
        {fill(dict.prenatalTest.headingForBaby, { name: baby.name })}
      </p>
      <TestList controlFor={(test) => <TestRecordControl baby={baby} test={test} point={point} today={today} />} />
    </>
  );
}

export function PrenatalTestSchedule() {
  const { locale, dict } = useLocale();
  const loaded = useAppSelector(selectBabiesLoaded);
  const baby = useAppSelector(selectSelectedBaby);
  if (loaded && baby) return <BabySchedule key={baby.id} baby={baby} />;
  return (
    <>
      <TestList />
      <div className="mt-6 flex justify-center">
        <Link href={localePath(locale)} className={buttonClass("primary")}>
          {dict.guide.trackCta}
          <Icon name="arrowRight" className="size-4" />
        </Link>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { buttonClass } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { DoseRow } from "@/components/molecules/DoseRow";
import { selectBabiesLoaded, selectSelectedBaby, type Baby } from "@/features/babies/babiesSlice";
import { currentPointForProgress, growthProgress } from "@/features/growth/timeline";
import { useLocale } from "@/features/locale/LocaleProvider";
import { fill } from "@/features/locale/format";
import { describeMilestone } from "@/features/vaccinations/describeDose";
import { scheduleMilestones } from "@/features/vaccinations/dose-status";
import type { VaccineDose } from "@/features/vaccinations/vaccine-doses";
import { todayIso } from "@/lib/date";
import { localePath } from "@/lib/site";
import { useAppSelector } from "@/store/hooks";
import { DoseRecordControl } from "./DoseRecordControl";

const MILESTONE_GROUPS = scheduleMilestones();

function MilestoneGroups({ controlFor }: { controlFor?: (dose: VaccineDose) => ReactNode }) {
  const { dict } = useLocale();
  return (
    <div className="flex flex-col gap-5">
      {MILESTONE_GROUPS.map(({ milestone, doses }) => (
        <section key={milestone} aria-labelledby={`milestone-${milestone}`}>
          <h2 id={`milestone-${milestone}`} className="text-lg font-extrabold">
            {describeMilestone(milestone, dict)}
          </h2>
          <ul className="mt-2 flex flex-col gap-2">
            {doses.map((dose) => (
              <DoseRow key={dose.id} dose={dose} dict={dict}>
                {controlFor?.(dose)}
              </DoseRow>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function BabySchedule({ baby }: { baby: Baby }) {
  const { dict } = useLocale();
  const [today] = useState(todayIso);
  const point = currentPointForProgress(growthProgress(baby.lastPeriodDate, today));
  return (
    <>
      <p className="mb-4 text-lg font-extrabold text-brand-strong">
        {fill(dict.vaccination.headingForBaby, { name: baby.name })}
      </p>
      <MilestoneGroups
        controlFor={(dose) => <DoseRecordControl baby={baby} dose={dose} point={point} today={today} />}
      />
    </>
  );
}

export function VaccineSchedule() {
  const { locale, dict } = useLocale();
  const loaded = useAppSelector(selectBabiesLoaded);
  const baby = useAppSelector(selectSelectedBaby);
  if (loaded && baby) return <BabySchedule key={baby.id} baby={baby} />;
  return (
    <>
      <MilestoneGroups />
      <div className="mt-6 flex justify-center">
        <Link href={localePath(locale)} className={buttonClass("primary")}>
          {dict.guide.trackCta}
          <Icon name="arrowRight" className="size-4" />
        </Link>
      </div>
    </>
  );
}

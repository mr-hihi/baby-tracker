"use client";

import { useState, type ReactNode } from "react";
import { DoseRow } from "@/components/molecules/DoseRow";
import { ScheduleCard } from "@/components/molecules/ScheduleCard";
import { selectBabiesLoaded, selectSelectedBaby, type Baby } from "@/features/babies/babiesSlice";
import type { GrowthStep } from "@/features/growth/steps";
import { currentPointForProgress, growthProgress } from "@/features/growth/timeline";
import { useLocale } from "@/features/locale/LocaleProvider";
import { fill } from "@/features/locale/format";
import { dosesAtStep, overdueDosesBeforeStep } from "@/features/vaccinations/dose-status";
import type { VaccineDose } from "@/features/vaccinations/vaccine-doses";
import { todayIso } from "@/lib/date";
import { localePath, VACCINES_PATH } from "@/lib/site";
import { useAppSelector } from "@/store/hooks";
import { DoseRecordControl } from "./DoseRecordControl";

function SectionFrame({ heading, children }: { heading: string; children: ReactNode }) {
  const { locale, dict } = useLocale();
  return (
    <ScheduleCard
      headingId="vaccines-heading"
      heading={heading}
      scheduleHref={localePath(locale, VACCINES_PATH)}
      scheduleLabel={dict.vaccination.fullSchedule}
    >
      {children}
    </ScheduleCard>
  );
}

function DoseList({ id, title, doses, controlFor }: {
  id: string;
  title: string;
  doses: VaccineDose[];
  controlFor?: (dose: VaccineDose) => ReactNode;
}) {
  const { dict } = useLocale();
  if (doses.length === 0) return null;
  return (
    <section aria-labelledby={id} className="py-3 last:pb-0">
      <h3 id={id} className="text-sm font-bold text-muted">
        {title}
      </h3>
      <ul className="mt-1.5 flex flex-col gap-1.5">
        {doses.map((dose) => (
          <DoseRow key={dose.id} dose={dose} dict={dict}>
            {controlFor?.(dose)}
          </DoseRow>
        ))}
      </ul>
    </section>
  );
}

function BabyVaccineSection({ step, baby }: { step: GrowthStep; baby: Baby }) {
  const { dict } = useLocale();
  const [today] = useState(todayIso);
  const point = currentPointForProgress(growthProgress(baby.lastPeriodDate, today));
  const atStep = dosesAtStep(step);
  const overdue = overdueDosesBeforeStep(step, point, baby.vaccinations ?? {});
  if (atStep.length === 0 && overdue.length === 0) return null;
  const controlFor = (dose: VaccineDose) => <DoseRecordControl baby={baby} dose={dose} point={point} today={today} />;
  return (
    <SectionFrame heading={fill(dict.vaccination.headingForBaby, { name: baby.name })}>
      <DoseList id="vaccines-at-step" title={dict.vaccination.atStep} doses={atStep} controlFor={controlFor} />
      <DoseList id="vaccines-overdue" title={dict.vaccination.notYetGiven} doses={overdue} controlFor={controlFor} />
    </SectionFrame>
  );
}

export function VaccineSection({ step }: { step: GrowthStep }) {
  const { dict } = useLocale();
  const loaded = useAppSelector(selectBabiesLoaded);
  const baby = useAppSelector(selectSelectedBaby);
  if (loaded && baby) return <BabyVaccineSection key={baby.id} step={step} baby={baby} />;
  const atStep = dosesAtStep(step);
  if (atStep.length === 0) return null;
  return (
    <SectionFrame heading={dict.vaccination.heading}>
      <DoseList id="vaccines-at-step" title={dict.vaccination.atStep} doses={atStep} />
    </SectionFrame>
  );
}

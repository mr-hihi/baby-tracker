"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { DoseRow } from "@/components/molecules/DoseRow";
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
    <section aria-labelledby="vaccines-heading" className="mt-6 rounded-[2rem] bg-surface p-5 shadow-card">
      <h2 id="vaccines-heading" className="text-xl font-extrabold">
        {heading}
      </h2>
      {children}
      <Link
        href={localePath(locale, VACCINES_PATH)}
        className="mt-4 inline-block text-sm font-bold text-brand underline-offset-2 hover:underline"
      >
        {dict.vaccination.fullSchedule}
      </Link>
    </section>
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
    <section aria-labelledby={id} className="mt-4">
      <h3 id={id} className="text-sm font-bold text-muted">
        {title}
      </h3>
      <ul className="mt-2 flex flex-col gap-2">
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

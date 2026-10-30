"use client";

import Link from "next/link";
import { DoseRow } from "@/components/molecules/DoseRow";
import type { Baby } from "@/features/babies/babiesSlice";
import type { GrowthStep } from "@/features/growth/steps";
import { useLocale } from "@/features/locale/LocaleProvider";
import { fill, formatIsoDate } from "@/features/locale/format";
import { doseEstimatedDate, dosesNeedingAction, nextUpcomingDose } from "@/features/vaccinations/dose-status";
import type { IsoDate } from "@/lib/date";
import { localePath, VACCINES_PATH } from "@/lib/site";
import { DoseRecordControl } from "./DoseRecordControl";

function NothingDueMessage({ baby, point }: { baby: Baby; point: GrowthStep }) {
  const { locale, dict } = useLocale();
  const next = nextUpcomingDose(point, baby.vaccinations ?? {});
  if (!next) return <p className="mt-3 text-sm text-muted">{dict.vaccination.allDone}</p>;
  return (
    <p className="mt-3 text-sm text-muted">
      {fill(dict.vaccination.nextDose, {
        vaccine: dict.vaccines[next.vaccine],
        date: formatIsoDate(doseEstimatedDate(next, baby.lastPeriodDate), locale),
      })}
    </p>
  );
}

export function VaccineCard({ baby, point, today }: { baby: Baby; point: GrowthStep; today: IsoDate }) {
  const { locale, dict } = useLocale();
  const doses = dosesNeedingAction(point, baby.vaccinations ?? {});
  return (
    <section aria-labelledby="vaccine-card-heading" className="mt-6 rounded-[2rem] bg-surface p-5 shadow-card">
      <h2 id="vaccine-card-heading" className="text-xl font-extrabold">
        {dict.vaccination.heading}
      </h2>
      {doses.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-2">
          {doses.map((dose) => (
            <DoseRow key={dose.id} dose={dose} dict={dict}>
              <DoseRecordControl baby={baby} dose={dose} point={point} today={today} />
            </DoseRow>
          ))}
        </ul>
      ) : (
        <NothingDueMessage baby={baby} point={point} />
      )}
      <Link
        href={localePath(locale, VACCINES_PATH)}
        className="mt-4 inline-block text-sm font-bold text-brand underline-offset-2 hover:underline"
      >
        {dict.vaccination.fullSchedule}
      </Link>
    </section>
  );
}

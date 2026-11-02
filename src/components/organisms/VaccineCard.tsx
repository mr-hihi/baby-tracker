"use client";

import { DoseRow } from "@/components/molecules/DoseRow";
import { ScheduleCard } from "@/components/molecules/ScheduleCard";
import type { Baby } from "@/features/babies/babiesSlice";
import type { GrowthStep } from "@/features/growth/steps";
import { useLocale } from "@/features/locale/LocaleProvider";
import { fill, formatIsoDate } from "@/features/locale/format";
import { scheduleStartDate } from "@/features/schedule/schedule-status";
import { dosesNeedingAction, nextUpcomingDose } from "@/features/vaccinations/dose-status";
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
        date: formatIsoDate(scheduleStartDate(next, baby.lastPeriodDate), locale),
      })}
    </p>
  );
}

export function VaccineCard({ baby, point, today }: { baby: Baby; point: GrowthStep; today: IsoDate }) {
  const { locale, dict } = useLocale();
  const doses = dosesNeedingAction(point, baby.vaccinations ?? {});
  return (
    <ScheduleCard
      headingId="vaccine-card-heading"
      heading={dict.vaccination.heading}
      scheduleHref={localePath(locale, VACCINES_PATH)}
      scheduleLabel={dict.vaccination.fullSchedule}
    >
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
    </ScheduleCard>
  );
}

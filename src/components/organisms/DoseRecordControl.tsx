"use client";

import { doseRecorded, doseRecordRemoved, type Baby } from "@/features/babies/babiesSlice";
import type { GrowthStep } from "@/features/growth/steps";
import { useLocale } from "@/features/locale/LocaleProvider";
import { scheduleStartDate, scheduleStatus } from "@/features/schedule/schedule-status";
import { describeDose } from "@/features/vaccinations/describeDose";
import type { VaccineDose } from "@/features/vaccinations/vaccine-doses";
import type { IsoDate } from "@/lib/date";
import { useAppDispatch } from "@/store/hooks";
import { ScheduleRecordControl } from "./ScheduleRecordControl";

export function DoseRecordControl({ baby, dose, point, today }: {
  baby: Baby;
  dose: VaccineDose;
  point: GrowthStep;
  today: IsoDate;
}) {
  const { dict } = useLocale();
  const dispatch = useAppDispatch();
  const vaccinations = baby.vaccinations ?? {};
  const { vaccine, doseLabel } = describeDose(dose, dict);
  const record = { babyId: baby.id, doseId: dose.id };

  return (
    <ScheduleRecordControl
      itemName={`${vaccine} ${doseLabel}`}
      status={scheduleStatus(dose, point, vaccinations)}
      recordedDate={vaccinations[dose.id]}
      estimatedDate={scheduleStartDate(dose, baby.lastPeriodDate)}
      lastPeriodDate={baby.lastPeriodDate}
      today={today}
      labels={dict.vaccination}
      onRecord={(date) => dispatch(doseRecorded({ ...record, date }))}
      onRemove={() => dispatch(doseRecordRemoved(record))}
    />
  );
}

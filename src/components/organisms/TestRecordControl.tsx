"use client";

import { testRecorded, testRecordRemoved, type Baby } from "@/features/babies/babiesSlice";
import type { GrowthStep } from "@/features/growth/steps";
import { useLocale } from "@/features/locale/LocaleProvider";
import type { PrenatalTest } from "@/features/prenatal-tests/prenatal-tests";
import { scheduleStartDate, scheduleStatus } from "@/features/schedule/schedule-status";
import type { IsoDate } from "@/lib/date";
import { useAppDispatch } from "@/store/hooks";
import { ScheduleRecordControl } from "./ScheduleRecordControl";

export function TestRecordControl({ baby, test, point, today }: {
  baby: Baby;
  test: PrenatalTest;
  point: GrowthStep;
  today: IsoDate;
}) {
  const { dict } = useLocale();
  const dispatch = useAppDispatch();
  const prenatalTests = baby.prenatalTests ?? {};
  const record = { babyId: baby.id, testId: test.id };

  return (
    <ScheduleRecordControl
      itemName={dict.prenatalTestTexts[test.id].name}
      status={scheduleStatus(test, point, prenatalTests)}
      recordedDate={prenatalTests[test.id]}
      estimatedDate={scheduleStartDate(test, baby.lastPeriodDate)}
      lastPeriodDate={baby.lastPeriodDate}
      today={today}
      labels={dict.prenatalTest}
      onRecord={(date) => dispatch(testRecorded({ ...record, date }))}
      onRemove={() => dispatch(testRecordRemoved(record))}
    />
  );
}

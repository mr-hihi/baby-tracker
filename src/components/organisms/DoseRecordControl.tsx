"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import { TextField } from "@/components/atoms/TextField";
import { DoseStatusBadge } from "@/components/molecules/DoseStatusBadge";
import { doseRecorded, doseRecordRemoved, type Baby } from "@/features/babies/babiesSlice";
import type { GrowthStep } from "@/features/growth/steps";
import { useLocale } from "@/features/locale/LocaleProvider";
import { fill, formatIsoDate } from "@/features/locale/format";
import { describeDose } from "@/features/vaccinations/describeDose";
import { validateDoseDate, type DoseDateError } from "@/features/vaccinations/dose-date";
import { doseEstimatedDate, doseStatus } from "@/features/vaccinations/dose-status";
import type { VaccineDose } from "@/features/vaccinations/vaccine-doses";
import type { IsoDate } from "@/lib/date";
import { useAppDispatch } from "@/store/hooks";

type DoseDateFormProps = {
  baby: Baby;
  dose: VaccineDose;
  givenDate: IsoDate;
  today: IsoDate;
  onClose: () => void;
};

function DoseDateForm({ baby, dose, givenDate, today, onClose }: DoseDateFormProps) {
  const { dict } = useLocale();
  const dispatch = useAppDispatch();
  const id = useId();
  const [error, setError] = useState<DoseDateError>();

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = String(new FormData(event.currentTarget).get("doseDate") ?? "");
    const result = validateDoseDate(input, baby.lastPeriodDate, today);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    dispatch(doseRecorded({ babyId: baby.id, doseId: dose.id, date: result.date }));
    onClose();
  }

  return (
    <form noValidate onSubmit={save} onChange={() => setError(undefined)} className="mt-2 flex flex-col gap-2">
      <TextField
        id={`${id}-dose-date`}
        name="doseDate"
        type="date"
        label={dict.vaccination.dateLabel}
        defaultValue={givenDate}
        min={baby.lastPeriodDate}
        max={today}
        required
        error={error && dict.vaccination[error]}
      />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          {dict.form.cancel}
        </Button>
        <Button type="submit">{dict.form.save}</Button>
      </div>
    </form>
  );
}

export function DoseRecordControl({ baby, dose, point, today }: {
  baby: Baby;
  dose: VaccineDose;
  point: GrowthStep;
  today: IsoDate;
}) {
  const { locale, dict } = useLocale();
  const dispatch = useAppDispatch();
  const [isEditingDate, setIsEditingDate] = useState(false);
  const vaccinations = baby.vaccinations ?? {};
  const givenDate = vaccinations[dose.id];
  const status = doseStatus(dose, point, vaccinations);
  const estimatedDate = doseEstimatedDate(dose, baby.lastPeriodDate);
  const isPending = status === "due" || status === "overdue";
  const { vaccine, doseLabel } = describeDose(dose, dict);
  const { vaccination } = dict;

  function toggleGiven(isGiven: boolean) {
    setIsEditingDate(false);
    const record = { babyId: baby.id, doseId: dose.id };
    dispatch(isGiven ? doseRecorded({ ...record, date: today }) : doseRecordRemoved(record));
  }

  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-center gap-2">
        <DoseStatusBadge status={status} date={formatIsoDate(givenDate ?? estimatedDate, locale)} dict={dict} />
        {isPending && (
          <span className="text-xs text-muted">
            {fill(vaccination.scheduledFor, { date: formatIsoDate(estimatedDate, locale) })}
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-4">
        <label className="flex min-h-10 cursor-pointer items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={givenDate !== undefined}
            onChange={(event) => toggleGiven(event.target.checked)}
            className="size-5 accent-brand"
          />
          {vaccination.given}
          <span className="sr-only">
            {": "}
            {vaccine} {doseLabel}
          </span>
        </label>
        {givenDate && !isEditingDate && (
          <button
            type="button"
            onClick={() => setIsEditingDate(true)}
            className="min-h-10 text-sm font-bold text-brand underline-offset-2 hover:underline"
          >
            {vaccination.changeDate}
          </button>
        )}
      </div>
      {givenDate && isEditingDate && (
        <DoseDateForm
          baby={baby}
          dose={dose}
          givenDate={givenDate}
          today={today}
          onClose={() => setIsEditingDate(false)}
        />
      )}
    </div>
  );
}

"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import { TextField } from "@/components/atoms/TextField";
import { ScheduleStatusBadge, type StatusLabels } from "@/components/molecules/ScheduleStatusBadge";
import { useLocale } from "@/features/locale/LocaleProvider";
import { fill, formatIsoDate } from "@/features/locale/format";
import { validateRecordDate, type RecordDateError } from "@/features/schedule/record-date";
import type { ScheduleStatus } from "@/features/schedule/schedule-status";
import type { IsoDate } from "@/lib/date";

export type ScheduleLabels = StatusLabels &
  Record<RecordDateError, string> & {
    recorded: string;
    scheduledFor: string;
    changeDate: string;
    dateLabel: string;
  };

type RecordDateFormProps = {
  recordedDate: IsoDate;
  lastPeriodDate: IsoDate;
  today: IsoDate;
  labels: ScheduleLabels;
  onRecord: (date: IsoDate) => void;
  onClose: () => void;
};

function RecordDateForm({ recordedDate, lastPeriodDate, today, labels, onRecord, onClose }: RecordDateFormProps) {
  const { dict } = useLocale();
  const id = useId();
  const [error, setError] = useState<RecordDateError>();

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = String(new FormData(event.currentTarget).get("recordDate") ?? "");
    const result = validateRecordDate(input, lastPeriodDate, today);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onRecord(result.date);
    onClose();
  }

  return (
    <form noValidate onSubmit={save} onChange={() => setError(undefined)} className="mt-2 flex flex-col gap-2">
      <TextField
        id={`${id}-record-date`}
        name="recordDate"
        type="date"
        label={labels.dateLabel}
        defaultValue={recordedDate}
        min={lastPeriodDate}
        max={today}
        required
        error={error && labels[error]}
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

type ScheduleRecordControlProps = {
  itemName: string;
  status: ScheduleStatus;
  recordedDate?: IsoDate;
  estimatedDate: IsoDate;
  lastPeriodDate: IsoDate;
  today: IsoDate;
  labels: ScheduleLabels;
  onRecord: (date: IsoDate) => void;
  onRemove: () => void;
};

export function ScheduleRecordControl({
  itemName,
  status,
  recordedDate,
  estimatedDate,
  lastPeriodDate,
  today,
  labels,
  onRecord,
  onRemove,
}: ScheduleRecordControlProps) {
  const { locale } = useLocale();
  const [isEditingDate, setIsEditingDate] = useState(false);
  const isPending = status === "due" || status === "overdue";

  function toggleRecorded(isRecorded: boolean) {
    setIsEditingDate(false);
    if (isRecorded) onRecord(today);
    else onRemove();
  }

  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-center gap-2">
        <ScheduleStatusBadge
          status={status}
          date={formatIsoDate(recordedDate ?? estimatedDate, locale)}
          labels={labels}
        />
        {isPending && (
          <span className="text-xs text-muted">
            {fill(labels.scheduledFor, { date: formatIsoDate(estimatedDate, locale) })}
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-4">
        <label className="flex min-h-10 cursor-pointer items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={recordedDate !== undefined}
            onChange={(event) => toggleRecorded(event.target.checked)}
            className="size-5 accent-brand"
          />
          {labels.recorded}
          <span className="sr-only">
            {": "}
            {itemName}
          </span>
        </label>
        {recordedDate && !isEditingDate && (
          <button
            type="button"
            onClick={() => setIsEditingDate(true)}
            className="min-h-10 text-sm font-bold text-brand underline-offset-2 hover:underline"
          >
            {labels.changeDate}
          </button>
        )}
      </div>
      {recordedDate && isEditingDate && (
        <RecordDateForm
          recordedDate={recordedDate}
          lastPeriodDate={lastPeriodDate}
          today={today}
          labels={labels}
          onRecord={onRecord}
          onClose={() => setIsEditingDate(false)}
        />
      )}
    </div>
  );
}

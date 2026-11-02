import { fill } from "@/features/locale/format";
import type { ScheduleStatus } from "@/features/schedule/schedule-status";

export type StatusLabels = { statusDone: string; statusUpcoming: string; statusDue: string; statusOverdue: string };

const STATUS_STYLES: Record<ScheduleStatus, string> = {
  done: "bg-brand-soft text-brand-strong",
  upcoming: "bg-surface text-muted",
  due: "bg-brand text-white",
  overdue: "border border-danger text-danger",
};

export function ScheduleStatusBadge({ status, date, labels }: {
  status: ScheduleStatus;
  date: string;
  labels: StatusLabels;
}) {
  const texts: Record<ScheduleStatus, string> = {
    done: fill(labels.statusDone, { date }),
    upcoming: fill(labels.statusUpcoming, { date }),
    due: labels.statusDue,
    overdue: labels.statusOverdue,
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_STYLES[status]}`}>{texts[status]}</span>
  );
}

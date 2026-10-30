import type { Dictionary } from "@/features/locale/dictionaries";
import { fill } from "@/features/locale/format";
import type { DoseStatus } from "@/features/vaccinations/dose-status";

const STATUS_STYLES: Record<DoseStatus, string> = {
  done: "bg-brand-soft text-brand-strong",
  upcoming: "bg-surface text-muted",
  due: "bg-brand text-white",
  overdue: "border border-danger text-danger",
};

export function DoseStatusBadge({ status, date, dict }: { status: DoseStatus; date: string; dict: Dictionary }) {
  const { vaccination } = dict;
  const labels: Record<DoseStatus, string> = {
    done: fill(vaccination.statusDone, { date }),
    upcoming: fill(vaccination.statusUpcoming, { date }),
    due: vaccination.statusDue,
    overdue: vaccination.statusOverdue,
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_STYLES[status]}`}>{labels[status]}</span>
  );
}

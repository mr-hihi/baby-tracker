import Link from "next/link";
import type { ReactNode } from "react";

type ScheduleCardProps = {
  headingId: string;
  heading: string;
  scheduleHref: string;
  scheduleLabel: string;
  children: ReactNode;
};

export function ScheduleCard({ headingId, heading, scheduleHref, scheduleLabel, children }: ScheduleCardProps) {
  return (
    <section aria-labelledby={headingId} className="mt-4 rounded-[2rem] bg-surface p-4 shadow-card">
      <h2 id={headingId} className="text-xl font-extrabold">
        {heading}
      </h2>
      <div className="divide-y divide-dashed divide-line">{children}</div>
      <Link
        href={scheduleHref}
        className="mt-3 inline-block text-sm font-bold text-brand underline-offset-2 hover:underline"
      >
        {scheduleLabel}
      </Link>
    </section>
  );
}

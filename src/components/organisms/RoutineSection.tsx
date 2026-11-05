import type { GrowthStep } from "@/features/growth/steps";
import type { Dictionary } from "@/features/locale/dictionaries";
import type { Locale } from "@/features/locale/locales";
import { describeFeeding, describeSleep, type RoutineBlock } from "@/features/routine/describeRoutine";
import { routineForStep } from "@/features/routine/routine-stages";

function RoutineBlockView({ id, heading, block }: { id: string; heading: string; block: RoutineBlock }) {
  return (
    <section aria-labelledby={id} className="py-3 last:pb-0">
      <h3 id={id} className="text-sm font-bold text-muted">
        {heading}
      </h3>
      <dl className="mt-1.5 flex flex-col gap-1 rounded-2xl bg-page px-3 py-2">
        {block.rows.map((row) => (
          <div key={row.label} className="flex flex-wrap items-baseline justify-between gap-x-3">
            <dt className="text-sm text-muted">{row.label}</dt>
            <dd className="font-bold">{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-1.5 text-sm leading-relaxed">{block.tip}</p>
      {block.notes.map((note) => (
        <p key={note} className="mt-1 text-xs text-muted">
          {note}
        </p>
      ))}
      {block.sources.map((source) => (
        <p key={source} className="mt-0.5 text-xs text-muted">
          {source}
        </p>
      ))}
    </section>
  );
}

export function RoutineSection({ step, locale, dict }: { step: GrowthStep; locale: Locale; dict: Dictionary }) {
  const { feeding, sleep } = routineForStep(step);
  if (!feeding && !sleep) return null;
  const { routine } = dict;
  return (
    <section aria-labelledby="routine-heading" className="mt-4 rounded-[2rem] bg-surface p-4 shadow-card">
      <h2 id="routine-heading" className="text-xl font-extrabold">
        {routine.heading}
      </h2>
      <div className="divide-y divide-dashed divide-line">
        {feeding && (
          <RoutineBlockView
            id="routine-feeding"
            heading={routine.feedingHeading}
            block={describeFeeding(feeding, locale, dict)}
          />
        )}
        {sleep && (
          <RoutineBlockView id="routine-sleep" heading={routine.sleepHeading} block={describeSleep(sleep, locale, dict)} />
        )}
      </div>
    </section>
  );
}

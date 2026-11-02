import { careGroupsForStep } from "@/features/care/care-items";
import type { GrowthStep } from "@/features/growth/steps";
import type { Dictionary } from "@/features/locale/dictionaries";

const BADGE = "rounded-full px-2 py-0.5 text-xs font-bold";

export function CareSection({ step, dict }: { step: GrowthStep; dict: Dictionary }) {
  const groups = careGroupsForStep(step);
  if (groups.length === 0) return null;
  const { care, careItems } = dict;
  return (
    <section aria-labelledby="care-heading" className="mt-4 rounded-[2rem] bg-surface p-4 shadow-card">
      <h2 id="care-heading" className="text-xl font-extrabold">
        {care.heading}
      </h2>
      <div className="divide-y divide-dashed divide-line">
        {groups.map((group) => (
          <section key={group.category} aria-labelledby={`care-${group.category}`} className="py-3 last:pb-0">
            <h3 id={`care-${group.category}`} className="text-sm font-bold text-muted">
              {care.groups[group.category]}
            </h3>
            <ul className="mt-1.5 flex flex-col gap-1.5">
              {group.entries.map(({ item, isNew, showsSubject }) => (
                <li key={item.id} className="rounded-2xl bg-page px-3 py-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold">{careItems[item.id].title}</span>
                    {isNew && <span className={`${BADGE} bg-brand text-white`}>{care.newBadge[step.kind]}</span>}
                    {showsSubject && (
                      <span className={`${BADGE} bg-brand-soft text-brand-strong`}>{care.subjects[item.subject]}</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm leading-relaxed">{careItems[item.id].detail}</p>
                  <p className="mt-0.5 text-xs text-muted">{care.sources[item.source]}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}

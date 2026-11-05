import type { GrowthStep } from "@/features/growth/steps";
import type { Dictionary } from "@/features/locale/dictionaries";
import { skillsForStep } from "@/features/skills/skill-items";

const BADGE = "rounded-full px-2 py-0.5 text-xs font-bold";

export function SkillSection({ step, dict }: { step: GrowthStep; dict: Dictionary }) {
  const entries = skillsForStep(step);
  if (entries.length === 0) return null;
  const { skills, skillItems } = dict;
  return (
    <section aria-labelledby="skills-heading" className="mt-4 rounded-[2rem] bg-surface p-4 shadow-card">
      <h2 id="skills-heading" className="text-xl font-extrabold">
        {skills.heading}
      </h2>
      <ul className="mt-3 flex flex-col gap-1.5">
        {entries.map(({ item, isNew }) => (
          <li key={item.id} className="rounded-2xl bg-page px-3 py-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-bold">{skillItems[item.id].title}</span>
              <span className={`${BADGE} bg-brand-soft text-brand-strong`}>{skills.areas[item.area]}</span>
              {isNew && <span className={`${BADGE} bg-brand text-white`}>{dict.care.newBadge[step.kind]}</span>}
            </div>
            <p className="mt-0.5 text-sm leading-relaxed">{skillItems[item.id].detail}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">{skills.source}</p>
    </section>
  );
}

import { growthStats } from "@/features/growth/stats";
import type { GrowthStep } from "@/features/growth/steps";
import type { Dictionary } from "@/features/locale/dictionaries";
import { formatLength, formatWeight } from "@/features/locale/format";
import type { Locale } from "@/features/locale/locales";

export function AgeComparison({ step, locale, dict }: { step: GrowthStep; locale: Locale; dict: Dictionary }) {
  const rows = [
    { label: dict.growth.boyValue, stats: growthStats(step, "boy") },
    { label: dict.growth.girlValue, stats: growthStats(step, "girl") },
  ];
  const sizeLabel = rows[0].stats.measure === "length" ? dict.growth.length : dict.growth.height;
  return (
    <table className="w-full overflow-hidden rounded-2xl bg-surface text-left text-sm shadow-card">
      <thead className="bg-brand-soft text-brand-strong">
        <tr>
          <th scope="col" className="px-4 py-2.5" />
          <th scope="col" className="px-4 py-2.5">{sizeLabel}</th>
          <th scope="col" className="px-4 py-2.5">{dict.growth.weight}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-t border-line">
            <th scope="row" className="px-4 py-2.5 font-bold">{row.label}</th>
            <td className="px-4 py-2.5">
              {row.stats.sizeCm === undefined ? dict.growth.notYet : formatLength(row.stats.sizeCm, locale)}
            </td>
            <td className="px-4 py-2.5">
              {row.stats.weightG === undefined ? dict.growth.notYet : formatWeight(row.stats.weightG, locale, dict)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

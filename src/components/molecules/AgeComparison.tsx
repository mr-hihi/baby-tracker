import { bodySize } from "@/features/growth/childhood-years";
import type { Dictionary } from "@/features/locale/dictionaries";
import { formatLength, formatWeight } from "@/features/locale/format";
import type { Locale } from "@/features/locale/locales";

export function AgeComparison({ age, locale, dict }: { age: number; locale: Locale; dict: Dictionary }) {
  const rows = [
    { label: dict.growth.boyValue, size: bodySize(age, "boy") },
    { label: dict.growth.girlValue, size: bodySize(age, "girl") },
  ];
  return (
    <table className="w-full overflow-hidden rounded-2xl bg-surface text-left text-sm shadow-card">
      <thead className="bg-brand-soft text-brand-strong">
        <tr>
          <th scope="col" className="px-4 py-2.5" />
          <th scope="col" className="px-4 py-2.5">{dict.growth.height}</th>
          <th scope="col" className="px-4 py-2.5">{dict.growth.weight}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-t border-line">
            <th scope="row" className="px-4 py-2.5 font-bold">{row.label}</th>
            <td className="px-4 py-2.5">{formatLength(row.size.heightCm, locale)}</td>
            <td className="px-4 py-2.5">{formatWeight(row.size.weightKg * 1000, locale, dict)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

import type { ReactNode } from "react";
import type { Dictionary } from "@/features/locale/dictionaries";
import { describeDose } from "@/features/vaccinations/describeDose";
import type { VaccineDose } from "@/features/vaccinations/vaccine-doses";

export function DoseRow({ dose, dict, children }: { dose: VaccineDose; dict: Dictionary; children?: ReactNode }) {
  const { vaccine, doseLabel, note } = describeDose(dose, dict);
  return (
    <li className="rounded-2xl bg-page px-4 py-3">
      <p className="font-bold">
        {vaccine} <span className="font-normal text-muted">· {doseLabel}</span>
      </p>
      {note && <p className="mt-0.5 text-xs text-muted">{note}</p>}
      {children}
    </li>
  );
}

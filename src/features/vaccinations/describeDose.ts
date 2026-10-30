import type { Dictionary } from "@/features/locale/dictionaries";
import { fill } from "@/features/locale/format";
import type { ScheduleMilestone } from "./dose-status";
import type { VaccineDose, VaccineDoseId } from "./vaccine-doses";

export type DoseDescription = { vaccine: string; doseLabel: string; note?: string };

export function describeDose(dose: VaccineDose, dict: Dictionary): DoseDescription {
  const notes: Partial<Record<VaccineDoseId, string>> = dict.doseNotes;
  return {
    vaccine: dict.vaccines[dose.vaccine],
    doseLabel: dose.dose === "booster" ? dict.vaccination.booster : fill(dict.vaccination.doseLabel, { n: dose.dose }),
    note: notes[dose.id],
  };
}

export function describeMilestone(milestone: ScheduleMilestone, dict: Dictionary): string {
  if (milestone === "pregnancy") return dict.vaccination.milestonePregnancy;
  if (milestone === 0) return dict.vaccination.milestoneBirth;
  return fill(dict.vaccination.milestoneMonths, { n: milestone });
}

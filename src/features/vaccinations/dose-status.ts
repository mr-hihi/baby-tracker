import type { GrowthStep } from "@/features/growth/steps";
import {
  itemsAtStep,
  itemsNeedingAction,
  nextUpcomingItem,
  overdueItemsBeforeStep,
} from "@/features/schedule/schedule-status";
import { VACCINE_DOSES, type DoseSubject, type VaccinationRecord, type VaccineDose } from "./vaccine-doses";

export type ScheduleMilestone = "pregnancy" | number;
export type MilestoneGroup = { milestone: ScheduleMilestone; doses: VaccineDose[] };

function dosesToTrack(point: GrowthStep): VaccineDose[] {
  return VACCINE_DOSES.filter((dose) => point.kind === "week" || dose.subject === "baby");
}

export function dosesAtStep(step: GrowthStep): VaccineDose[] {
  return itemsAtStep(VACCINE_DOSES, step);
}

export function overdueDosesBeforeStep(
  step: GrowthStep,
  point: GrowthStep,
  vaccinations: VaccinationRecord,
): VaccineDose[] {
  const pageSubject: DoseSubject = step.kind === "week" ? "mother" : "baby";
  const pageDoses = VACCINE_DOSES.filter((dose) => dose.subject === pageSubject);
  return overdueItemsBeforeStep(pageDoses, step, point, vaccinations);
}

export function dosesNeedingAction(point: GrowthStep, vaccinations: VaccinationRecord): VaccineDose[] {
  return itemsNeedingAction(dosesToTrack(point), point, vaccinations);
}

export function nextUpcomingDose(point: GrowthStep, vaccinations: VaccinationRecord): VaccineDose | undefined {
  return nextUpcomingItem(dosesToTrack(point), point, vaccinations);
}

function milestoneOf(dose: VaccineDose): ScheduleMilestone {
  return dose.stepKind === "week" ? "pregnancy" : dose.from;
}

export function scheduleMilestones(): MilestoneGroup[] {
  const groups: MilestoneGroup[] = [];
  for (const dose of VACCINE_DOSES) {
    const milestone = milestoneOf(dose);
    const last = groups.at(-1);
    if (last?.milestone === milestone) last.doses.push(dose);
    else groups.push({ milestone, doses: [dose] });
  }
  return groups;
}

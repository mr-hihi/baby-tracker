import { compareSteps, type GrowthStep } from "@/features/growth/steps";
import { stepStartDate } from "@/features/growth/timeline";
import type { IsoDate } from "@/lib/date";
import { VACCINE_DOSES, type DoseSubject, type VaccinationRecord, type VaccineDose } from "./vaccine-doses";

export type DoseStatus = "done" | "upcoming" | "due" | "overdue";

export type ScheduleMilestone = "pregnancy" | number;
export type MilestoneGroup = { milestone: ScheduleMilestone; doses: VaccineDose[] };

function windowStart(dose: VaccineDose): GrowthStep {
  return { kind: dose.stepKind, value: dose.from };
}

function windowEnd(dose: VaccineDose): GrowthStep {
  return { kind: dose.stepKind, value: dose.to };
}

function dosesToTrack(point: GrowthStep): VaccineDose[] {
  return VACCINE_DOSES.filter((dose) => point.kind === "week" || dose.subject === "baby");
}

export function doseStatus(dose: VaccineDose, point: GrowthStep, vaccinations: VaccinationRecord): DoseStatus {
  if (vaccinations[dose.id]) return "done";
  if (compareSteps(point, windowStart(dose)) < 0) return "upcoming";
  if (compareSteps(point, windowEnd(dose)) <= 0) return "due";
  return "overdue";
}

export function dosesAtStep(step: GrowthStep): VaccineDose[] {
  return VACCINE_DOSES.filter(
    (dose) => compareSteps(windowStart(dose), step) <= 0 && compareSteps(step, windowEnd(dose)) <= 0,
  );
}

export function overdueDosesBeforeStep(
  step: GrowthStep,
  point: GrowthStep,
  vaccinations: VaccinationRecord,
): VaccineDose[] {
  const pageSubject: DoseSubject = step.kind === "week" ? "mother" : "baby";
  return VACCINE_DOSES.filter(
    (dose) =>
      dose.subject === pageSubject &&
      compareSteps(windowEnd(dose), step) < 0 &&
      doseStatus(dose, point, vaccinations) === "overdue",
  );
}

export function dosesNeedingAction(point: GrowthStep, vaccinations: VaccinationRecord): VaccineDose[] {
  const doses = dosesToTrack(point);
  const dosesWith = (status: DoseStatus) => doses.filter((dose) => doseStatus(dose, point, vaccinations) === status);
  return [...dosesWith("due"), ...dosesWith("overdue")];
}

export function nextUpcomingDose(point: GrowthStep, vaccinations: VaccinationRecord): VaccineDose | undefined {
  return dosesToTrack(point).find((dose) => doseStatus(dose, point, vaccinations) === "upcoming");
}

export function doseEstimatedDate(dose: VaccineDose, lastPeriodDate: IsoDate): IsoDate {
  return stepStartDate(windowStart(dose), lastPeriodDate);
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

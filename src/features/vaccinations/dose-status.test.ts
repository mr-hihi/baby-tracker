import { describe, expect, it } from "vitest";
import { ageStep, monthStep, weekStep } from "@/features/growth/steps";
import {
  dosesAtStep,
  dosesNeedingAction,
  nextUpcomingDose,
  overdueDosesBeforeStep,
  scheduleMilestones,
} from "./dose-status";
import { VACCINE_DOSES, type VaccineDose, type VaccineDoseId } from "./vaccine-doses";

function ids(doses: readonly VaccineDose[]): string[] {
  return doses.map((dose) => dose.id);
}

function recordOf(...doseIds: VaccineDoseId[]) {
  return Object.fromEntries(doseIds.map((id) => [id, "2026-09-01"]));
}

const ALL_DONE = recordOf(...VACCINE_DOSES.map((dose) => dose.id));

describe("dosesAtStep", () => {
  it("lists the doses whose window holds the week", () => {
    expect(ids(dosesAtStep(weekStep(24)))).toEqual(["tetanus-1", "tetanus-2"]);
  });

  it("lists the birth doses at month 0 and none of the pregnancy ones", () => {
    expect(ids(dosesAtStep(monthStep(0)))).toEqual(["hepb-birth", "bcg"]);
  });

  it("lists two doses at month 9", () => {
    expect(ids(dosesAtStep(monthStep(9)))).toEqual(["measles-1", "ipv-2"]);
  });

  it("lists the last dose at age 2", () => {
    expect(ids(dosesAtStep(ageStep(2)))).toEqual(["je-3"]);
  });

  it("is empty between windows", () => {
    expect(dosesAtStep(weekStep(10))).toEqual([]);
    expect(dosesAtStep(monthStep(7))).toEqual([]);
    expect(dosesAtStep(ageStep(5))).toEqual([]);
  });
});

describe("overdueDosesBeforeStep", () => {
  it("lists the baby doses that closed before the month and are still open", () => {
    expect(ids(overdueDosesBeforeStep(monthStep(6), monthStep(6), {}))).toEqual([
      "hepb-birth",
      "bcg",
      "dtp-hepb-hib-1",
      "opv-1",
      "dtp-hepb-hib-2",
      "opv-2",
      "dtp-hepb-hib-3",
      "opv-3",
      "ipv-1",
    ]);
  });

  it("leaves out a dose that is already recorded", () => {
    expect(ids(overdueDosesBeforeStep(monthStep(2), monthStep(6), recordOf("bcg")))).toEqual(["hepb-birth"]);
  });

  it("leaves out a dose that ends on the step itself", () => {
    expect(ids(overdueDosesBeforeStep(monthStep(2), monthStep(6), {}))).toEqual(["hepb-birth", "bcg"]);
  });

  it("leaves out a dose that is not overdue at the current point", () => {
    expect(ids(overdueDosesBeforeStep(monthStep(24), monthStep(4), {}))).toEqual([
      "hepb-birth",
      "bcg",
      "dtp-hepb-hib-1",
      "opv-1",
      "dtp-hepb-hib-2",
      "opv-2",
    ]);
  });

  it("shows the mother's missed doses on a pregnancy week page after birth", () => {
    expect(ids(overdueDosesBeforeStep(weekStep(40), monthStep(1), {}))).toEqual(["tetanus-1", "tetanus-2"]);
  });

  it("shows only the mother's doses on a pregnancy week page", () => {
    expect(ids(overdueDosesBeforeStep(weekStep(34), weekStep(34), {}))).toEqual(["tetanus-1"]);
  });
});

describe("dosesNeedingAction", () => {
  it("lists due doses before overdue ones", () => {
    expect(ids(dosesNeedingAction(monthStep(2), {}))).toEqual(["dtp-hepb-hib-1", "opv-1", "hepb-birth", "bcg"]);
  });

  it("lists the mother's due doses during pregnancy", () => {
    expect(ids(dosesNeedingAction(weekStep(24), {}))).toEqual(["tetanus-1", "tetanus-2"]);
  });

  it("puts an overdue pregnancy dose after a due one", () => {
    expect(ids(dosesNeedingAction(weekStep(34), {}))).toEqual(["tetanus-2", "tetanus-1"]);
  });

  it("hides the mother's doses once the baby is born", () => {
    expect(ids(dosesNeedingAction(monthStep(0), {}))).toEqual(["hepb-birth", "bcg"]);
  });

  it("is empty before the first window", () => {
    expect(dosesNeedingAction(weekStep(5), {})).toEqual([]);
  });

  it("is empty when every dose is recorded", () => {
    expect(dosesNeedingAction(monthStep(24), ALL_DONE)).toEqual([]);
  });
});

describe("nextUpcomingDose", () => {
  it("is the first dose still ahead", () => {
    expect(nextUpcomingDose(monthStep(2), {})?.id).toBe("dtp-hepb-hib-2");
    expect(nextUpcomingDose(weekStep(10), {})?.id).toBe("tetanus-1");
  });

  it("skips a recorded dose", () => {
    expect(nextUpcomingDose(monthStep(2), recordOf("dtp-hepb-hib-2"))?.id).toBe("opv-2");
  });

  it("is undefined when everything is recorded", () => {
    expect(nextUpcomingDose(monthStep(2), ALL_DONE)).toBeUndefined();
  });

  it("is undefined when everything left is overdue", () => {
    expect(nextUpcomingDose(ageStep(3), {})).toBeUndefined();
  });
});

describe("scheduleMilestones", () => {
  it("groups the doses into 10 milestones in order", () => {
    expect(scheduleMilestones().map((group) => group.milestone)).toEqual([
      "pregnancy",
      0,
      2,
      3,
      4,
      5,
      9,
      12,
      18,
      24,
    ]);
  });

  it("gathers consecutive doses of one milestone", () => {
    const groups = scheduleMilestones();
    expect(ids(groups[0].doses)).toEqual(["tetanus-1", "tetanus-2"]);
    expect(ids(groups[2].doses)).toEqual(["dtp-hepb-hib-1", "opv-1"]);
    expect(ids(groups[5].doses)).toEqual(["ipv-1"]);
  });

  it("keeps every dose exactly once", () => {
    expect(scheduleMilestones().flatMap((group) => ids(group.doses))).toEqual(ids(VACCINE_DOSES));
  });
});

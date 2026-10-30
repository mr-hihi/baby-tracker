import { describe, expect, it } from "vitest";
import { en } from "@/features/locale/dictionaries/en";
import { vi } from "@/features/locale/dictionaries/vi";
import { describeDose, describeMilestone } from "./describeDose";
import { VACCINE_DOSES, type VaccineDoseId } from "./vaccine-doses";

function doseOf(id: VaccineDoseId) {
  return VACCINE_DOSES.find((dose) => dose.id === id)!;
}

describe("describeDose", () => {
  it("describes a numbered dose with its note in English", () => {
    expect(describeDose(doseOf("tetanus-1"), en)).toEqual({
      vaccine: "Tetanus",
      doseLabel: "Dose 1",
      note: "First pregnancy; ask the health station if you had doses before",
    });
  });

  it("describes a booster without a note in English", () => {
    expect(describeDose(doseOf("dtp-booster"), en)).toEqual({ vaccine: "DTP", doseLabel: "Booster", note: undefined });
  });

  it("describes a numbered dose without a note in Vietnamese", () => {
    expect(describeDose(doseOf("opv-2"), vi)).toEqual({ vaccine: "Bại liệt uống", doseLabel: "Mũi 2", note: undefined });
  });

  it("describes a booster in Vietnamese", () => {
    expect(describeDose(doseOf("dtp-booster"), vi).doseLabel).toBe("Mũi nhắc");
  });
});

describe("describeMilestone", () => {
  it("names the pregnancy milestone", () => {
    expect(describeMilestone("pregnancy", en)).toBe("Pregnancy");
    expect(describeMilestone("pregnancy", vi)).toBe("Mang thai");
  });

  it("names month 0 as the birth", () => {
    expect(describeMilestone(0, en)).toBe("At birth");
    expect(describeMilestone(0, vi)).toBe("Sơ sinh");
  });

  it("names any other month by its number", () => {
    expect(describeMilestone(9, en)).toBe("9 months");
    expect(describeMilestone(9, vi)).toBe("9 tháng");
  });
});

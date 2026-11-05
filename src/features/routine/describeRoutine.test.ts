import { describe, expect, it } from "vitest";
import { ageStep, monthStep, type GrowthStep } from "@/features/growth/steps";
import { en } from "@/features/locale/dictionaries/en";
import { vi } from "@/features/locale/dictionaries/vi";
import { describeFeeding, describeSleep, type RoutineBlock } from "./describeRoutine";
import { routineForStep } from "./routine-stages";

function feedingOf(step: GrowthStep, dict: typeof vi, locale: "vi" | "en"): RoutineBlock {
  return describeFeeding(routineForStep(step).feeding!, locale, dict);
}

function sleepOf(step: GrowthStep, dict: typeof vi, locale: "vi" | "en"): RoutineBlock {
  return describeSleep(routineForStep(step).sleep!, locale, dict);
}

const NEWBORN_FEEDING_VI = feedingOf(monthStep(0), vi, "vi");
const FAMILY_FEEDING_VI = feedingOf(monthStep(12), vi, "vi");
const TODDLER_FEEDING_VI = feedingOf(ageStep(2), vi, "vi");
const TEEN_FEEDING_EN = feedingOf(ageStep(13), en, "en");
const NEWBORN_SLEEP_VI = sleepOf(monthStep(0), vi, "vi");
const AGE_2_SLEEP_EN = sleepOf(ageStep(2), en, "en");
const AGE_5_SLEEP_EN = sleepOf(ageStep(5), en, "en");

describe("describeFeeding", () => {
  it("lists the milk rhythm of month 0", () => {
    expect(NEWBORN_FEEDING_VI.rows).toEqual([
      { label: "Cách nhau", value: "2,5–3 giờ" },
      { label: "Mỗi cữ (bú bình)", value: "30–90 ml" },
      { label: "Số cữ mỗi ngày", value: "8–10 cữ" },
    ]);
  });

  it("adds the breastfeeding and formula notes to a milk stage", () => {
    expect(NEWBORN_FEEDING_VI.notes).toEqual([vi.routine.breastfeedingNote, vi.routine.formulaLimitNote]);
  });

  it("names the E.A.S.Y. and AAP source of a milk stage", () => {
    expect(NEWBORN_FEEDING_VI.sources).toEqual(["Nguồn: Nhịp E.A.S.Y. (Tracy Hogg); lượng sữa theo AAP"]);
  });

  it("uses the stage tip", () => {
    expect(NEWBORN_FEEDING_VI.tip).toBe(vi.routineStages["milk-newborn"]);
  });

  it("shows only daily milk from month 12", () => {
    expect(FAMILY_FEEDING_VI).toEqual({
      rows: [{ label: "Sữa và chế phẩm sữa (quy ra sữa)", value: "480–720 ml/ngày" }],
      tip: vi.routineStages["meals-family"],
      notes: [],
      sources: ["Nguồn: AAP"],
    });
  });

  it("lists meals, snacks and dairy at age 2", () => {
    expect(TODDLER_FEEDING_VI.rows).toEqual([
      { label: "Bữa chính", value: "3 bữa" },
      { label: "Bữa phụ", value: "2 bữa" },
      { label: "Sữa và chế phẩm sữa (quy ra sữa)", value: "480 ml/ngày" },
    ]);
  });

  it("uses English plurals for a range of snacks", () => {
    expect(TEEN_FEEDING_EN.rows).toEqual([
      { label: "Main meals", value: "3 meals" },
      { label: "Snacks", value: "1–2 snacks" },
      { label: "Milk and dairy (as milk)", value: "720 ml a day" },
    ]);
  });
});

describe("describeSleep", () => {
  it("lists hours and naps of month 0 with both sources", () => {
    expect(NEWBORN_SLEEP_VI).toEqual({
      rows: [
        { label: "Tổng giờ ngủ", value: "14–17 giờ/ngày" },
        { label: "Giấc ngày", value: "4–5 giấc" },
      ],
      tip: vi.routineStages["sleep-newborn"],
      notes: [],
      sources: ["Nguồn: WHO 2019", "Số giấc: E.A.S.Y. (Tracy Hogg)"],
    });
  });

  it("uses the singular for one nap at age 2", () => {
    expect(AGE_2_SLEEP_EN.rows).toEqual([
      { label: "Total sleep", value: "11–14 hours a day" },
      { label: "Daytime naps", value: "1 nap" },
    ]);
  });

  it("drops the naps row and its source when the stage has no naps", () => {
    expect(AGE_5_SLEEP_EN).toEqual({
      rows: [{ label: "Total sleep", value: "10–13 hours a day" }],
      tip: en.routineStages["sleep-age-5"],
      notes: [],
      sources: ["Source: AASM 2016 (endorsed by the AAP)"],
    });
  });
});

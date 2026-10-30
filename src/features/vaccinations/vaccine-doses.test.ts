import { describe, expect, it } from "vitest";
import { VACCINE_DOSES, VACCINES } from "./vaccine-doses";

describe("VACCINE_DOSES", () => {
  it("lists the 18 doses of the national programme", () => {
    expect(VACCINE_DOSES).toHaveLength(18);
  });

  it("has unique ids", () => {
    expect(new Set(VACCINE_DOSES.map((dose) => dose.id)).size).toBe(VACCINE_DOSES.length);
  });

  it("never ends a window before it starts", () => {
    for (const dose of VACCINE_DOSES) expect(dose.from, dose.id).toBeLessThanOrEqual(dose.to);
  });

  it("gives the mother the pregnancy-week doses and the baby the month doses", () => {
    for (const dose of VACCINE_DOSES) {
      expect(dose.subject, dose.id).toBe(dose.stepKind === "week" ? "mother" : "baby");
    }
  });

  it("keeps windows inside weeks 1–40 and months 0–24", () => {
    for (const dose of VACCINE_DOSES) {
      const [min, max] = dose.stepKind === "week" ? [1, 40] : [0, 24];
      expect(dose.from, dose.id).toBeGreaterThanOrEqual(min);
      expect(dose.to, dose.id).toBeLessThanOrEqual(max);
    }
  });

  it("only uses listed vaccines", () => {
    for (const dose of VACCINE_DOSES) expect(VACCINES, dose.id).toContain(dose.vaccine);
  });

  it("orders doses by the step they start", () => {
    const starts = VACCINE_DOSES.map((dose) => (dose.stepKind === "week" ? dose.from - 100 : dose.from));
    expect(starts).toEqual([...starts].sort((a, b) => a - b));
  });
});

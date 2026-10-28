import { describe, expect, it } from "vitest";
import { en } from "./dictionaries/en";
import { vi } from "./dictionaries/vi";
import {
  count,
  fill,
  formatBeatRange,
  formatChildAge,
  formatIsoDate,
  formatLength,
  formatPregnancyAge,
  formatWeight,
} from "./format";
import { switchLocaleInPath } from "./locales";

describe("fill", () => {
  it("replaces known placeholders and keeps unknown ones", () => {
    expect(fill("{a} and {b}", { a: 1 })).toBe("1 and {b}");
  });
});

describe("count", () => {
  it("uses the singular form for one in English", () => {
    expect(count(en.units.week, 1, "en")).toBe("1 week");
  });

  it("uses the plural form otherwise in English", () => {
    expect(count(en.units.day, 3, "en")).toBe("3 days");
  });
});

describe("formatLength", () => {
  it("switches to millimetres under 1 cm", () => {
    expect(formatLength(0.5, "en")).toBe("5 mm");
  });

  it("uses a decimal comma in Vietnamese", () => {
    expect(formatLength(37.6, "vi")).toBe("37,6 cm");
  });
});

describe("formatWeight", () => {
  it("says under 1 g for tiny weights", () => {
    expect(formatWeight(0.2, "vi", vi)).toBe("dưới 1 g");
  });

  it("uses grams under 1 kg", () => {
    expect(formatWeight(875, "en", en)).toBe("875 g");
  });

  it("keeps three decimals under 10 kg", () => {
    expect(formatWeight(1005, "vi", vi)).toBe("1,005 kg");
  });

  it("keeps one decimal from 10 kg", () => {
    expect(formatWeight(66900, "en", en)).toBe("66.9 kg");
  });
});

describe("formatBeatRange", () => {
  it("fills the range into the template", () => {
    expect(formatBeatRange([120, 160], en)).toBe("120–160 beats/min");
  });
});

describe("formatIsoDate", () => {
  it("uses day/month/year in Vietnamese", () => {
    expect(formatIsoDate("2027-01-06", "vi")).toBe("06/01/2027");
  });

  it("uses a short month name in English", () => {
    expect(formatIsoDate("2027-01-06", "en")).toBe("Jan 6, 2027");
  });
});

describe("formatPregnancyAge", () => {
  it("shows weeks and days", () => {
    expect(formatPregnancyAge(27, 3, "vi", vi)).toBe("27 tuần 3 ngày");
  });

  it("keeps zero days", () => {
    expect(formatPregnancyAge(21, 0, "vi", vi)).toBe("21 tuần 0 ngày");
  });

  it("keeps zero weeks in the first week", () => {
    expect(formatPregnancyAge(0, 3, "vi", vi)).toBe("0 tuần 3 ngày");
  });

  it("uses the plural for zero in English", () => {
    expect(formatPregnancyAge(0, 0, "en", en)).toBe("0 weeks 0 days");
  });

  it("uses the singular for one in English", () => {
    expect(formatPregnancyAge(1, 1, "en", en)).toBe("1 week 1 day");
  });
});

describe("formatChildAge", () => {
  it("shows years and months", () => {
    expect(formatChildAge({ years: 5, months: 3, days: 2 }, "vi", vi)).toBe("5 tuổi 3 tháng");
  });

  it("shows only years on a whole-year boundary", () => {
    expect(formatChildAge({ years: 1, months: 0, days: 9 }, "en", en)).toBe("1 year");
  });

  it("shows months and days in the first year", () => {
    expect(formatChildAge({ years: 0, months: 4, days: 1 }, "en", en)).toBe("4 months 1 day");
  });

  it("shows only months when days are zero", () => {
    expect(formatChildAge({ years: 0, months: 2, days: 0 }, "vi", vi)).toBe("2 tháng");
  });

  it("shows only days in the first month", () => {
    expect(formatChildAge({ years: 0, months: 0, days: 12 }, "vi", vi)).toBe("12 ngày");
  });
});

describe("switchLocaleInPath", () => {
  it("swaps the locale of a nested page", () => {
    expect(switchLocaleInPath("/vi/week/28/", "en")).toBe("/en/week/28/");
  });

  it("swaps the locale of the home page", () => {
    expect(switchLocaleInPath("/en", "vi")).toBe("/vi/");
  });
});

import { describe, expect, it } from "vitest";
import { growthProgress } from "@/features/growth/timeline";
import { en } from "@/features/locale/dictionaries/en";
import { vi } from "@/features/locale/dictionaries/vi";
import { describeProgress } from "./describeProgress";

describe("describeProgress", () => {
  it("describes a pregnancy in Vietnamese", () => {
    expect(describeProgress(growthProgress("2026-04-01", "2026-10-27"), "vi", vi)).toEqual({
      headline: "29 tuần 6 ngày",
      details: ["Ngày thứ 210 của thai kỳ", "Dự sinh 06/01/2027 · còn 71 ngày"],
    });
  });

  it("describes a child in English", () => {
    expect(describeProgress(growthProgress("2020-01-01", "2026-10-27"), "en", en)).toEqual({
      headline: "6 years",
      details: ["2,211 days since birth", "Estimated birth date Oct 7, 2020"],
    });
  });
});

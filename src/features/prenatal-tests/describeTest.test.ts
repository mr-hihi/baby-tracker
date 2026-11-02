import { describe, expect, it } from "vitest";
import { en } from "@/features/locale/dictionaries/en";
import { vi } from "@/features/locale/dictionaries/vi";
import { describeTest } from "./describeTest";
import { PRENATAL_TESTS } from "./prenatal-tests";

const [NIPT] = PRENATAL_TESTS;

describe("describeTest", () => {
  it("describes NIPT with its window in English", () => {
    expect(describeTest(NIPT, en)).toEqual({
      name: "NIPT (non-invasive prenatal test)",
      weeks: "Weeks 10–14",
      note: "A blood test from the mother; screens for Down, Edwards and Patau syndromes",
    });
  });

  it("describes NIPT with its window in Vietnamese", () => {
    expect(describeTest(NIPT, vi)).toEqual({
      name: "NIPT (sàng lọc trước sinh không xâm lấn)",
      weeks: "Tuần 10–14",
      note: "Lấy máu mẹ; sàng lọc hội chứng Down, Edwards, Patau",
    });
  });
});

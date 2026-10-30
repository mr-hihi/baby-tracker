import type { GrowthStep, StepKind } from "@/features/growth/steps";

export const CARE_CATEGORIES = ["supplement", "eat", "avoid"] as const;

export type CareCategory = (typeof CARE_CATEGORIES)[number];
export type CareSubject = "mother" | "baby";
export type CareSource = "moh" | "who";

type CareItemFields = {
  id: string;
  category: CareCategory;
  subject: CareSubject;
  stepKind: StepKind;
  from: number;
  to: number;
  source: CareSource;
};

export const CARE_ITEMS = [
  { id: "folic-acid", category: "supplement", subject: "mother", stepKind: "week", from: 1, to: 12, source: "who" },
  { id: "iron-folic-acid", category: "supplement", subject: "mother", stepKind: "week", from: 13, to: 40, source: "who" },
  { id: "calcium", category: "supplement", subject: "mother", stepKind: "week", from: 20, to: 40, source: "who" },
  { id: "varied-meals", category: "eat", subject: "mother", stepKind: "week", from: 1, to: 40, source: "moh" },
  { id: "small-meals", category: "eat", subject: "mother", stepKind: "week", from: 5, to: 13, source: "moh" },
  { id: "fibre-water", category: "eat", subject: "mother", stepKind: "week", from: 14, to: 40, source: "moh" },
  { id: "no-alcohol-smoking", category: "avoid", subject: "mother", stepKind: "week", from: 1, to: 40, source: "who" },
  { id: "no-raw-food", category: "avoid", subject: "mother", stepKind: "week", from: 1, to: 40, source: "moh" },
  { id: "limit-caffeine", category: "avoid", subject: "mother", stepKind: "week", from: 1, to: 40, source: "who" },
  { id: "mother-vitamin-a", category: "supplement", subject: "mother", stepKind: "month", from: 0, to: 1, source: "moh" },
  { id: "mother-iron", category: "supplement", subject: "mother", stepKind: "month", from: 0, to: 1, source: "moh" },
  { id: "mother-no-alcohol", category: "avoid", subject: "mother", stepKind: "month", from: 0, to: 6, source: "who" },
  { id: "exclusive-breastfeeding", category: "eat", subject: "baby", stepKind: "month", from: 0, to: 5, source: "who" },
  { id: "no-water-before-6m", category: "avoid", subject: "baby", stepKind: "month", from: 0, to: 5, source: "who" },
  { id: "start-solids", category: "eat", subject: "baby", stepKind: "month", from: 6, to: 8, source: "who" },
  { id: "mashed-meals", category: "eat", subject: "baby", stepKind: "month", from: 9, to: 11, source: "who" },
  { id: "family-food", category: "eat", subject: "baby", stepKind: "month", from: 12, to: 24, source: "who" },
  { id: "baby-vitamin-a", category: "supplement", subject: "baby", stepKind: "month", from: 6, to: 24, source: "moh" },
  { id: "no-salt-sugar", category: "avoid", subject: "baby", stepKind: "month", from: 6, to: 24, source: "who" },
  { id: "vitamin-a-to-36m", category: "supplement", subject: "baby", stepKind: "age", from: 2, to: 2, source: "moh" },
  { id: "varied-child-diet", category: "eat", subject: "baby", stepKind: "age", from: 2, to: 18, source: "moh" },
  { id: "no-sugary-drinks", category: "avoid", subject: "baby", stepKind: "age", from: 2, to: 18, source: "who" },
] as const satisfies readonly CareItemFields[];

export type CareItem = (typeof CARE_ITEMS)[number];
export type CareItemId = CareItem["id"];

export const DEFAULT_CARE_SUBJECT: Record<StepKind, CareSubject> = { week: "mother", month: "baby", age: "baby" };

export type CareEntry = { item: CareItem; isNew: boolean; showsSubject: boolean };
export type CareGroup = { category: CareCategory; entries: CareEntry[] };

function appliesTo(item: CareItem, step: GrowthStep): boolean {
  return item.stepKind === step.kind && item.from <= step.value && step.value <= item.to;
}

export function careGroupsForStep(step: GrowthStep): CareGroup[] {
  const applicable = CARE_ITEMS.filter((item) => appliesTo(item, step));
  return CARE_CATEGORIES.map((category) => ({
    category,
    entries: applicable
      .filter((item) => item.category === category)
      .map((item) => ({
        item,
        isNew: item.from === step.value,
        showsSubject: item.subject !== DEFAULT_CARE_SUBJECT[step.kind],
      }))
      .sort((a, b) => Number(b.isNew) - Number(a.isNew)),
  })).filter((group) => group.entries.length > 0);
}

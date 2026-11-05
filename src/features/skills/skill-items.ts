import type { GrowthStep } from "@/features/growth/steps";

export const SKILL_AREAS = ["language", "movement", "thinking", "character", "independence", "social"] as const;

export type SkillArea = (typeof SKILL_AREAS)[number];

type SkillItemFields = { id: string; area: SkillArea; stepKind: "month" | "age"; from: number; to: number };

export const SKILL_ITEMS = [
  { id: "talk-all-day", area: "language", stepKind: "month", from: 0, to: 11 },
  { id: "move-every-day", area: "movement", stepKind: "month", from: 0, to: 11 },
  { id: "see-the-world", area: "thinking", stepKind: "month", from: 6, to: 24 },
  { id: "plain-speech", area: "language", stepKind: "month", from: 12, to: 24 },
  { id: "plain-speech-child", area: "language", stepKind: "age", from: 2, to: 5 },
  { id: "read-together", area: "language", stepKind: "age", from: 2, to: 10 },
  { id: "chores", area: "independence", stepKind: "age", from: 3, to: 12 },
  { id: "reasoned-talk", area: "thinking", stepKind: "age", from: 3, to: 18 },
  { id: "swim-and-rope", area: "movement", stepKind: "age", from: 4, to: 12 },
  { id: "perform", area: "social", stepKind: "age", from: 5, to: 12 },
  { id: "trips", area: "thinking", stepKind: "age", from: 6, to: 18 },
  { id: "focus", area: "character", stepKind: "age", from: 6, to: 12 },
  { id: "small-challenges", area: "character", stepKind: "age", from: 8, to: 18 },
  { id: "plan-time", area: "independence", stepKind: "age", from: 10, to: 18 },
  { id: "adult-topics", area: "thinking", stepKind: "age", from: 13, to: 18 },
  { id: "set-goals", area: "character", stepKind: "age", from: 13, to: 18 },
] as const satisfies readonly SkillItemFields[];

export type SkillItem = (typeof SKILL_ITEMS)[number];
export type SkillItemId = SkillItem["id"];

export type SkillEntry = { item: SkillItem; isNew: boolean };

function appliesTo(item: SkillItem, step: GrowthStep): boolean {
  return item.stepKind === step.kind && item.from <= step.value && step.value <= item.to;
}

export function skillsForStep(step: GrowthStep): SkillEntry[] {
  return SKILL_ITEMS.filter((item) => appliesTo(item, step))
    .map((item) => ({ item, isNew: item.from === step.value }))
    .sort((a, b) => Number(b.isNew) - Number(a.isNew));
}

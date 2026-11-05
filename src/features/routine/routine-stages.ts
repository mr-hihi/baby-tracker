import type { GrowthStep, StepKind } from "@/features/growth/steps";

export type Range = readonly [min: number, max: number];

type StageWindow = { id: string; from: number; to: number };

export type MilkStage = StageWindow & {
  stepKind: "month";
  intervalHours: Range;
  mlPerFeed: Range;
  feedsPerDay: Range;
  source: "easy-aap";
};

export type MealStage = StageWindow & {
  stepKind: "month" | "age";
  mainMeals?: Range;
  snacks?: Range;
  dairyMl: Range;
  source: "aap" | "aap-dga";
};

export type FeedingStage = MilkStage | MealStage;

export type SleepStage = StageWindow & {
  stepKind: "month" | "age";
  totalHours: Range;
  hoursSource: "who-2019" | "aasm-2016";
  naps?: Range;
  napsSource?: "easy";
};

export type RoutineSource = FeedingStage["source"] | SleepStage["hoursSource"] | NonNullable<SleepStage["napsSource"]>;

export const FEEDING_STAGES = [
  {
    id: "milk-newborn",
    stepKind: "month",
    from: 0,
    to: 0,
    intervalHours: [2.5, 3],
    mlPerFeed: [30, 90],
    feedsPerDay: [8, 10],
    source: "easy-aap",
  },
  {
    id: "milk-3-hour",
    stepKind: "month",
    from: 1,
    to: 3,
    intervalHours: [3, 3.5],
    mlPerFeed: [90, 120],
    feedsPerDay: [6, 8],
    source: "easy-aap",
  },
  {
    id: "milk-4-hour",
    stepKind: "month",
    from: 4,
    to: 5,
    intervalHours: [3.5, 4],
    mlPerFeed: [120, 180],
    feedsPerDay: [4, 5],
    source: "easy-aap",
  },
  {
    id: "milk-with-solids",
    stepKind: "month",
    from: 6,
    to: 8,
    intervalHours: [4, 4],
    mlPerFeed: [180, 240],
    feedsPerDay: [4, 5],
    source: "easy-aap",
  },
  {
    id: "milk-three-meals",
    stepKind: "month",
    from: 9,
    to: 11,
    intervalHours: [4, 5],
    mlPerFeed: [180, 240],
    feedsPerDay: [3, 4],
    source: "easy-aap",
  },
  { id: "meals-family", stepKind: "month", from: 12, to: 24, dairyMl: [480, 720], source: "aap" },
  {
    id: "meals-toddler",
    stepKind: "age",
    from: 2,
    to: 3,
    mainMeals: [3, 3],
    snacks: [2, 2],
    dairyMl: [480, 480],
    source: "aap-dga",
  },
  {
    id: "meals-preschool",
    stepKind: "age",
    from: 4,
    to: 5,
    mainMeals: [3, 3],
    snacks: [2, 2],
    dairyMl: [600, 600],
    source: "aap-dga",
  },
  {
    id: "meals-school",
    stepKind: "age",
    from: 6,
    to: 8,
    mainMeals: [3, 3],
    snacks: [1, 2],
    dairyMl: [600, 600],
    source: "aap-dga",
  },
  {
    id: "meals-older",
    stepKind: "age",
    from: 9,
    to: 18,
    mainMeals: [3, 3],
    snacks: [1, 2],
    dairyMl: [720, 720],
    source: "aap-dga",
  },
] as const satisfies readonly FeedingStage[];

export const SLEEP_STAGES = [
  {
    id: "sleep-newborn",
    stepKind: "month",
    from: 0,
    to: 0,
    totalHours: [14, 17],
    hoursSource: "who-2019",
    naps: [4, 5],
    napsSource: "easy",
  },
  {
    id: "sleep-young-infant",
    stepKind: "month",
    from: 1,
    to: 3,
    totalHours: [14, 17],
    hoursSource: "who-2019",
    naps: [3, 4],
    napsSource: "easy",
  },
  {
    id: "sleep-three-naps",
    stepKind: "month",
    from: 4,
    to: 5,
    totalHours: [12, 16],
    hoursSource: "who-2019",
    naps: [3, 4],
    napsSource: "easy",
  },
  {
    id: "sleep-two-three-naps",
    stepKind: "month",
    from: 6,
    to: 8,
    totalHours: [12, 16],
    hoursSource: "who-2019",
    naps: [2, 3],
    napsSource: "easy",
  },
  {
    id: "sleep-two-naps",
    stepKind: "month",
    from: 9,
    to: 11,
    totalHours: [12, 16],
    hoursSource: "who-2019",
    naps: [2, 2],
    napsSource: "easy",
  },
  {
    id: "sleep-one-two-naps",
    stepKind: "month",
    from: 12,
    to: 17,
    totalHours: [11, 14],
    hoursSource: "who-2019",
    naps: [1, 2],
    napsSource: "easy",
  },
  {
    id: "sleep-one-nap",
    stepKind: "month",
    from: 18,
    to: 24,
    totalHours: [11, 14],
    hoursSource: "who-2019",
    naps: [1, 1],
    napsSource: "easy",
  },
  {
    id: "sleep-age-2",
    stepKind: "age",
    from: 2,
    to: 2,
    totalHours: [11, 14],
    hoursSource: "who-2019",
    naps: [1, 1],
    napsSource: "easy",
  },
  { id: "sleep-preschool", stepKind: "age", from: 3, to: 4, totalHours: [10, 13], hoursSource: "who-2019" },
  { id: "sleep-age-5", stepKind: "age", from: 5, to: 5, totalHours: [10, 13], hoursSource: "aasm-2016" },
  { id: "sleep-school", stepKind: "age", from: 6, to: 12, totalHours: [9, 12], hoursSource: "aasm-2016" },
  { id: "sleep-teen", stepKind: "age", from: 13, to: 18, totalHours: [8, 10], hoursSource: "aasm-2016" },
] as const satisfies readonly SleepStage[];

export type RoutineStageId = (typeof FEEDING_STAGES)[number]["id"] | (typeof SLEEP_STAGES)[number]["id"];

export type Routine = { feeding?: FeedingStage; sleep?: SleepStage };

function appliesTo(stage: StageWindow & { stepKind: StepKind }, step: GrowthStep): boolean {
  return stage.stepKind === step.kind && stage.from <= step.value && step.value <= stage.to;
}

export function routineForStep(step: GrowthStep): Routine {
  return {
    feeding: FEEDING_STAGES.find((stage) => appliesTo(stage, step)),
    sleep: SLEEP_STAGES.find((stage) => appliesTo(stage, step)),
  };
}

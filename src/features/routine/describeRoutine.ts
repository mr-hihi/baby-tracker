import type { Dictionary, PluralForms } from "@/features/locale/dictionaries";
import { countRange, fill } from "@/features/locale/format";
import type { Locale } from "@/features/locale/locales";
import type { FeedingStage, MealStage, MilkStage, Range, SleepStage } from "./routine-stages";

export type RoutineRow = { label: string; value: string };

export type RoutineBlock = { rows: RoutineRow[]; tip: string; notes: string[]; sources: string[] };

type RowSpec = { label: string; range: Range | undefined; unit: PluralForms };

function buildRows(specs: RowSpec[], locale: Locale): RoutineRow[] {
  return specs.flatMap(({ label, range, unit }) => (range ? [{ label, value: countRange(unit, range, locale) }] : []));
}

function stageTip(stage: FeedingStage | SleepStage, dict: Dictionary): string {
  const tips: Record<string, string> = dict.routineStages;
  return tips[stage.id];
}

function sourceLine(source: string, dict: Dictionary): string {
  return fill(dict.routine.sourceLine, { source });
}

function milkBlock(stage: MilkStage, locale: Locale, dict: Dictionary): RoutineBlock {
  const { labels, units } = dict.routine;
  return {
    rows: buildRows(
      [
        { label: labels.interval, range: stage.intervalHours, unit: units.hours },
        { label: labels.perBottle, range: stage.mlPerFeed, unit: units.ml },
        { label: labels.feedsPerDay, range: stage.feedsPerDay, unit: units.feeds },
      ],
      locale,
    ),
    tip: stageTip(stage, dict),
    notes: [dict.routine.breastfeedingNote, dict.routine.formulaLimitNote],
    sources: [sourceLine(dict.routine.sources[stage.source], dict)],
  };
}

function mealBlock(stage: MealStage, locale: Locale, dict: Dictionary): RoutineBlock {
  const { labels, units } = dict.routine;
  return {
    rows: buildRows(
      [
        { label: labels.mainMeals, range: stage.mainMeals, unit: units.meals },
        { label: labels.snacks, range: stage.snacks, unit: units.snacks },
        { label: labels.dairy, range: stage.dairyMl, unit: units.mlPerDay },
      ],
      locale,
    ),
    tip: stageTip(stage, dict),
    notes: [],
    sources: [sourceLine(dict.routine.sources[stage.source], dict)],
  };
}

export function describeFeeding(stage: FeedingStage, locale: Locale, dict: Dictionary): RoutineBlock {
  return "mlPerFeed" in stage ? milkBlock(stage, locale, dict) : mealBlock(stage, locale, dict);
}

export function describeSleep(stage: SleepStage, locale: Locale, dict: Dictionary): RoutineBlock {
  const { labels, units, sources } = dict.routine;
  const hoursSource = sourceLine(sources[stage.hoursSource], dict);
  return {
    rows: buildRows(
      [
        { label: labels.totalSleep, range: stage.totalHours, unit: units.hoursPerDay },
        { label: labels.naps, range: stage.naps, unit: units.naps },
      ],
      locale,
    ),
    tip: stageTip(stage, dict),
    notes: [],
    sources: stage.napsSource
      ? [hoursSource, fill(dict.routine.napsSourceLine, { source: sources[stage.napsSource] })]
      : [hoursSource],
  };
}

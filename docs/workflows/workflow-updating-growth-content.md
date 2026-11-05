# Workflow: Updating Growth Content

## Replace illustrations with real images

- Keep the exact file names and folders from [ARCHITECTURE.md](../ARCHITECTURE.md) → **Images**; the code builds paths from them.
- Baby images: 4:3 (480×360 or larger, e.g. 960×720). Fruits: square, transparent background.
- Changing the format (e.g. `.webp`): update `babyImagePath` / `fruitImagePath` in `src/features/growth/stats.ts` and their tests.
- After birth there are three sets (`boy/`, `girl/`, root = neutral); all 19 ages must exist in each.

## Edit figures

- Pregnancy: `SIZES` and `ESTIMATED_SIZES` in `pregnancy-weeks.ts` (length cm, weight g), `EARLY_HEART`, all keyed by week page; the fruit order in `FRUITS` maps to week pages 4–40. Keep the table in [business/1-baby-progress.md](../business/1-baby-progress.md) → Pregnancy week figures in step.
- Months: `MEDIANS` in `infant-months.ts`.
- Childhood: `MEDIANS` and `RESTING_HEART` in `childhood-years.ts`. A row whose source or size method changes needs its `YEAR_REFERENCES` entry changed in the same edit.
- Keep [business/1-baby-progress.md](../business/1-baby-progress.md) → Year figures (sources) and the change examples in step with the code.
- Update the matching tests in `stats.test.ts`; the change tests fail when a month or age change is not above zero.
- Feeding and sleep stages (`routine-stages.ts`, `routineStages`) and skill items (`skill-items.ts`, `skillItems`): keep the tables in [business/5-feeding-sleep.md](../business/5-feeding-sleep.md) → 5.4 and [business/6-skills.md](../business/6-skills.md) → 6.4 in step with the code.

## Edit texts

- `weekNotes` (40 entries) and `ageMilestones` (19 entries) in both dictionaries — keep the counts.
- Adding a fruit: add the key to `FRUITS`, a name in both dictionaries (`satisfies Record<Fruit, string>` enforces it) and `public/assets/size/<key>.svg`.

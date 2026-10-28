# Workflow: Updating Growth Content

## Replace illustrations with real images

- Keep the exact file names and folders from [ARCHITECTURE.md](../ARCHITECTURE.md) → **Images**; the code builds paths from them.
- Baby images: 4:3 (480×360 or larger, e.g. 960×720). Fruits: square, transparent background.
- Changing the format (e.g. `.webp`): update `babyImagePath` / `fruitImagePath` in `src/features/growth/stats.ts` and their tests.
- After birth there are three sets (`boy/`, `girl/`, root = neutral); all 19 ages must exist in each.

## Edit figures

- Pregnancy: `MEASUREMENTS` in `pregnancy-weeks.ts` (length cm, weight g, early heart rate); the fruit order in `FRUITS` maps to weeks 4–40.
- Childhood: `MEDIANS` and `RESTING_HEART` in `childhood-years.ts`.
- Update the matching tests in `stats.test.ts`.

## Edit texts

- `weekNotes` (40 entries) and `ageMilestones` (19 entries) in both dictionaries — keep the counts.
- Adding a fruit: add the key to `FRUITS`, a name in both dictionaries (`satisfies Record<Fruit, string>` enforces it) and `public/assets/size/<key>.svg`.

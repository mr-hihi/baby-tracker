# Coding Conventions

## Naming

- Components `PascalCase.tsx`, one exported component per concept; modules `camelCase.ts` or `kebab-case.ts` as the folder already does (`pregnancy-weeks.ts`).
- Redux: slice `xxxSlice`, actions in past tense (`babyAdded`, `dialogClosed`), selectors `selectXxx`.
- Name for the domain: `lastPeriodDate`, `growthProgress`, `stepForProgress` — not `date1`, `data`, `info`.
  - ✅ `estimatedBirthDate(lastPeriodDate)` ❌ `calc(d)`

## Imports

- Use the `@/` alias for anything outside the current folder; relative imports only inside a folder.

## Text and i18n

- **Critical:** no user-visible literal in components; add the key to `vi.ts` first, then `en.ts` (the type forces it).
- Placeholders are `{name}` filled with `fill()`; counts go through `count()` with `PluralForms`.
- Numbers, lengths, weights, dates: always `formatNumber` / `formatLength` / `formatWeight` / `formatIsoDate` from `features/locale/format.ts`.
  - ✅ `formatWeight(1005, "vi", dict)` → `1,005 kg` ❌ `${w / 1000} kg`

## Dates and units

- **Critical:** dates are `IsoDate` strings (`YYYY-MM-DD`) and all math goes through `src/lib/date.ts` (UTC day arithmetic). Never compute with `Date` objects in local time.
- Weight is stored in grams, length in centimetres; rounding happens only when formatting.
- Today's date is read once per component with `useState(todayIso)`.

## Comments

- Default to none. The `@why` rule is in `AGENTS.md`.

## Errors and storage

- `localStorage` access is wrapped in `try/catch` and degrades to empty / no-op (private mode, quota).
- Saved data is validated on read (`parseSavedBabies`); invalid rows are dropped, never crash the app.

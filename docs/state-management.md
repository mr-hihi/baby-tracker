# State Management

## Who owns what

| State | Owner | Where |
|---|---|---|
| Babies, selected baby, loaded flag | Redux `babies` slice | `src/features/babies/babiesSlice.ts` |
| Which dialog is open | Redux `dialog` slice | `src/features/dialogs/dialogSlice.ts` |
| Locale | URL segment | `[locale]` + `LocaleProvider` |
| Step being browsed, form errors, today | Local `useState` | the component |
| Language preference for `/` | `localStorage["baby-tracker:locale"]` | `features/locale/preference.ts` |

- **Critical:** there is no server state; don't add TanStack Query or fetch calls.
- Put state in Redux only when two unrelated components need it (e.g. the menu opens a dialog the dashboard also opens).

## Persistence

- `Providers` (`src/app/providers.tsx`) loads once after mount (`babiesLoaded(readSavedBabies())`) and then writes on every change of `state.babies`.
- **Critical:** components must handle `loaded === false` (render a skeleton) — prerendered HTML never has babies.
- `selectSelectedBaby` falls back to the first baby when `selectedId` is missing.
- Shape on disk: `{ items: Baby[], selectedId: string | null }` under `baby-tracker:v1`.

## Rules

- Use `useAppSelector` / `useAppDispatch` from `src/store/hooks.ts`, never the untyped hooks.
- Slices declare selectors in `selectors:`; reducers stay pure (no `Date`, no storage).
- Register a new slice in `combineSlices(...)` in `src/store/index.ts`.

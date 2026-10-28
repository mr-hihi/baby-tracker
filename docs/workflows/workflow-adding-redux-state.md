# Workflow: Adding Redux State

1. Confirm it belongs in Redux ([state-management.md](../state-management.md)): two unrelated components need it. Otherwise use local state.
2. Copy [template-redux-state.md](../templates/template-redux-state.md) into `src/features/<feature>/<name>Slice.ts`.
3. Register it in `combineSlices(...)` in `src/store/index.ts`.
4. Must it survive reloads? Extend `src/store/persistence.ts` with validation on read and a test; a breaking shape change needs a new storage key + migration ([decisions.md](../decisions.md)).
5. Unit-test the reducer and selectors (`babiesSlice.test.ts` is the model).

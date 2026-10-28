# Testing Strategy

## Unit tests (Vitest)

- Files: `src/**/*.test.ts`, next to the module. Run `sh run.sh test` (or `npm test`).
- **Critical:** every pure module in `lib/`, `features/*`, `store/persistence.ts` keeps full branch (C2) coverage — each `if`, ternary, `??`, `catch` and loop-zero case is hit by a test, in its own test file or its caller's (`stats.test.ts` covers the tables in `pregnancy-weeks.ts` and `childhood-years.ts`).
- One behaviour per `it`; describe the behaviour, not the implementation.
  - ✅ `it("moves from week 40 to age 0")` ❌ `it("works")`
- Pass `today` explicitly; never depend on the real clock.
- Storage tests use an in-memory `Storage` stub (see `persistence.test.ts`); globals are stubbed with `vi.stubGlobal` and restored.

## Static checks

- Lint, typecheck and the static build are part of every validation; commands in [workflow-running-tests.md](workflows/workflow-running-tests.md). The build is the check that catches a non-exportable feature.

## E2E

- `sh run.sh start_test` serves on `http://localhost:5101` with `.env.test`; a different origin than dev (4071), so `localStorage` starts empty and dev data is untouched.
- No E2E suite yet; when adding one, drive the flows: add baby → dashboard, choose baby, edit baby, switch language, step through week 40 → age 0.

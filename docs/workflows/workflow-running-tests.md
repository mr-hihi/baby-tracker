# Workflow: Running Tests

Run all before calling a change done:

```sh
sh run.sh test                         # Vitest unit tests
npm run lint                           # ESLint (next core-web-vitals + typescript)
npx next typegen && npx tsc --noEmit   # route types + typecheck
sh run.sh build                        # proves every route still exports statically
```

- A single file: `npx vitest run src/features/growth/timeline.test.ts`.
- Watch mode: `npx vitest`.
- What to test and how: [testing-strategy.md](../testing-strategy.md).

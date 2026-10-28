# Workflow: Handling a New Task

Follow the phases in `AGENTS.md` → **Reading by phase**. On top of them:

1. Start from the closest existing code: `GrowthCard` for growth UI, `BabyFormDialog` for forms, `timeline.ts` for date logic, `[locale]/week/[week]/page.tsx` for a static page.
2. Build bottom-up: pure function + test → state → component → page.
3. Before calling it done, update the one doc that owns any rule you changed (see the table in [README.md](../README.md)), and register a new workflow or template in its `README.md`.

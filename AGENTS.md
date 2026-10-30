<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

**Read documentation first:** start at [docs/README.md](docs/README.md).

## Project Overview

Mobile-first web app that follows one or more babies day by day — from the first day of the last menstrual period, through 40 pregnancy weeks, up to age 18. Frontend only: Next.js 16 static export (no server), data in the browser's `localStorage`, Vietnamese / English, hosted on GitHub Pages. Node version pinned in `.node-version`. Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

<!-- BEGIN AUTO-MANAGED: business-docs (/ba-add) -->
## Business domain docs — MUST READ BEFORE ANY WORK

Business specs under `docs/business/` are the **source of truth** for behavior, data model,
workflow, API surface and permissions. Code is the implementation, not the spec.

**Mandatory protocol — before writing, editing, reviewing or testing ANY code:**

1. Open the index `docs/business.md` and identify which domain(s) the task touches.
2. Read the full business doc of every touched domain — including every sub-domain file under
   `docs/business/{N}-{slug}/` when the domain is split.
3. Read the matching test cases in `docs/test-cases/{N}-{slug}.md` before changing behavior.
4. If code and spec disagree → STOP and ask. Never silently treat the code as the spec.
5. If the change alters behavior → update the business doc + test cases in the SAME change.
   Specs describe the current state; they are never a changelog.

| # | Domain | Business doc | Test cases |
|---|---|---|---|
| 1 | Baby Progress | `docs/business/1-baby-progress.md` | `docs/test-cases/1-baby-progress.md` |
| 2 | Care Guide | `docs/business/2-care-guide.md` | `docs/test-cases/2-care-guide.md` |
| 3 | Vaccination Record | `docs/business/3-vaccination.md` | `docs/test-cases/3-vaccination.md` |

Skip only for: typo / formatting fixes, dependency bumps, and pure read-only questions.
<!-- END AUTO-MANAGED: business-docs -->

## Documentation

| Topic | Doc |
|---|---|
| Doc index, reading order, workflow process | [docs/README.md](docs/README.md) |
| Product, users, platform | [docs/project-overview.md](docs/project-overview.md) |
| Rendering, routing, data flow, SEO, env | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Stack choices and constraints | [docs/technology.md](docs/technology.md) |
| Folder map, Atomic Design levels | [docs/structure.md](docs/structure.md) |
| Naming, imports, comments, i18n text | [docs/coding-conventions.md](docs/coding-conventions.md) |
| Locked decisions | [docs/decisions.md](docs/decisions.md) |
| Redux vs local state, persistence | [docs/state-management.md](docs/state-management.md) |
| Tailwind tokens, layout | [docs/styling.md](docs/styling.md) |
| Component rules | [docs/components.md](docs/components.md) |
| Images, static output, bundle | [docs/performance.md](docs/performance.md) |
| Unit tests, E2E stack | [docs/testing-strategy.md](docs/testing-strategy.md) |
| Workflows registry | [docs/workflows/README.md](docs/workflows/README.md) |
| Templates registry | [docs/templates/README.md](docs/templates/README.md) |

## AI Agent Guidelines

### Do

- Follow the Atomic Design level and the existing patterns ([docs/structure.md](docs/structure.md)).
- Follow the text, i18n, date and unit rules ([docs/coding-conventions.md](docs/coding-conventions.md)).
- Keep the static-export and base-path rules ([docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)).
- Prefer updating concise AI documentation over inline comments; if a comment is truly necessary, use only a concise `@why` (≤3 lines) for non-obvious rationale or constraints, never describe what the code does, never put anything longer in the documentation.

### Don't

- Don't skip the docs listed in **When to read what**.
- Don't invent new patterns when an existing one fits.
- Don't hardcode secrets — every `NEXT_PUBLIC_*` value ships in the client bundle.
- Don't leave behaviour untested.
- Don't run `git commit --no-verify` (or skip hooks) without asking.
- Don't add a server-only feature (API route, Server Action, proxy, cookies, ISR, `cacheComponents`) — the site is a static export.
- Don't read `localStorage`, `window` or today's date during render of a prerendered page.
- Don't leave `console.log` calls; don't render unsanitized HTML.
- Don't ship inaccessible UI (missing labels, focus traps, keyboard dead ends).

### When to read what

| Task | Read first | Then | Scaffold template |
|---|---|---|---|
| New component | [structure.md](docs/structure.md), [components.md](docs/components.md) | [workflow-adding-a-component.md](docs/workflows/workflow-adding-a-component.md) | [template-component.md](docs/templates/template-component.md) |
| New page / route | [ARCHITECTURE.md](docs/ARCHITECTURE.md) | [workflow-adding-a-page.md](docs/workflows/workflow-adding-a-page.md) | [template-page.md](docs/templates/template-page.md) |
| State change | [state-management.md](docs/state-management.md) | [workflow-adding-redux-state.md](docs/workflows/workflow-adding-redux-state.md) | [template-redux-state.md](docs/templates/template-redux-state.md) |
| Styling change | [styling.md](docs/styling.md) | [components.md](docs/components.md) | — |
| Form | [components.md](docs/components.md) → Forms | [coding-conventions.md](docs/coding-conventions.md) | [template-component.md](docs/templates/template-component.md) |
| Accessibility | [components.md](docs/components.md) → Accessibility checklist | [styling.md](docs/styling.md) | — |
| Growth data, images, texts | [ARCHITECTURE.md](docs/ARCHITECTURE.md) | [workflow-updating-growth-content.md](docs/workflows/workflow-updating-growth-content.md) | — |
| Performance | [performance.md](docs/performance.md) | [ARCHITECTURE.md](docs/ARCHITECTURE.md) | — |
| Tests | [testing-strategy.md](docs/testing-strategy.md) | [workflow-running-tests.md](docs/workflows/workflow-running-tests.md) | — |
| Deploy | [workflow-deployment.md](docs/workflows/workflow-deployment.md) | [decisions.md](docs/decisions.md) | — |

### Reading by phase

| Phase | Do | Read |
|---|---|---|
| Analyze | Frame the task; pick its row in **When to read what** | [project-overview.md](docs/project-overview.md) |
| Research | Understand the current system and similar code | [ARCHITECTURE.md](docs/ARCHITECTURE.md), [technology.md](docs/technology.md), [structure.md](docs/structure.md), [state-management.md](docs/state-management.md) |
| Plan | Pick the workflow(s), then their template(s); choose the state owner (Redux / local / URL); write the steps; don't re-decide a locked choice | [decisions.md](docs/decisions.md), [workflows/README.md](docs/workflows/README.md), [templates/README.md](docs/templates/README.md) |
| Implement | Follow conventions and the chosen workflow; type all props; handle the not-loaded state of client data; keep it mobile-first and accessible | [coding-conventions.md](docs/coding-conventions.md), [styling.md](docs/styling.md), [components.md](docs/components.md) |
| Validate | Write + run tests, lint, typecheck, static build | [testing-strategy.md](docs/testing-strategy.md) |

## Important Notes

- Never commit `.env`, `.env.local`, `.env.stg`, `.env.prod`, `.env.test`, `out/`, `.next/`, `.claude/tmp/`, `.claude/temp/`. Only `.env.example` is tracked.
- Never use `--no-verify` without asking first.
- `NEXT_PUBLIC_*` env values are inlined into the client bundle at build time; never put a secret there.
- Don't start long-running dev servers from an agent session; ask the developer to run `sh run.sh start`.

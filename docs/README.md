# Documentation

## Documentation Structure

| Doc | Holds |
|---|---|
| [project-overview.md](project-overview.md) | Product purpose, users, platform, scope |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Rendering model, routes, data flow, growth rules, SEO, env |
| [technology.md](technology.md) | Why each stack piece, and its constraints |
| [structure.md](structure.md) | Folder map, Atomic Design levels, server vs client components |
| [coding-conventions.md](coding-conventions.md) | Naming, imports, comments, i18n text, dates and units |
| [decisions.md](decisions.md) | Locked decisions with guardrails |
| [state-management.md](state-management.md) | Redux vs local vs URL state, `localStorage` persistence |
| [styling.md](styling.md) | Tailwind tokens, layout, light-only theme |
| [components.md](components.md) | Component rules: props, dialogs, menus, images |
| [performance.md](performance.md) | Static output, images, bundle |
| [testing-strategy.md](testing-strategy.md) | Vitest unit tests, E2E stack |
| [workflows/README.md](workflows/README.md) | Workflow registry |
| [templates/README.md](templates/README.md) | Template registry |

## Required Reading Order

1. [project-overview.md](project-overview.md)
2. [../AGENTS.md](../AGENTS.md)
3. [ARCHITECTURE.md](ARCHITECTURE.md) + [structure.md](structure.md) + [state-management.md](state-management.md)
4. The task's workflow(s) + [coding-conventions.md](coding-conventions.md) + similar components

## Workflow Process

| Phase | Do | Read |
|---|---|---|
| Analyze | Frame the task; pick its row in `AGENTS.md` **When to read what** | [project-overview.md](project-overview.md) |
| Research | Understand the current system and similar code | [ARCHITECTURE.md](ARCHITECTURE.md), [technology.md](technology.md), [structure.md](structure.md), [state-management.md](state-management.md) |
| Plan | Pick workflow(s) then template(s); choose the state owner; write the steps | [decisions.md](decisions.md), [workflows/README.md](workflows/README.md), [templates/README.md](templates/README.md) |
| Implement | Follow conventions and the chosen workflow | [coding-conventions.md](coding-conventions.md), [styling.md](styling.md), [components.md](components.md) |
| Validate | Tests, lint, typecheck, static build | [testing-strategy.md](testing-strategy.md) |

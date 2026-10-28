# Workflow: Node Version Management

- The version lives only in `.node-version` (exact, e.g. `24.6.0`). nodenv reads it locally; CI reads it via `actions/setup-node` `node-version-file`.
- Next.js 16 needs Node ≥ 20.9; `vitest@5` needs `@types/node` ≥ 22 — keep `@types/node` on the pinned major.
- Upgrading: change `.node-version`, `nodenv install "$(cat .node-version)"`, bump `@types/node` to the same major, `npm install`, then [workflow-running-tests.md](workflow-running-tests.md).

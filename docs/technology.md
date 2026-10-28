# Technology

| Piece | Why | Constraint |
|---|---|---|
| Next.js App Router, `output: "export"` | SEO-ready static HTML per page; free hosting on GitHub Pages | **Critical:** no API routes, Server Actions, proxy, cookies, rewrites/redirects, ISR, default image optimizer |
| `cacheComponents` off | Cache Components / PPR need a server and forbid `dynamicParams` / `dynamic`, which export relies on | Don't enable it |
| Turbopack + `@tailwindcss/turbopack` loader | Default bundler of create-next-app 16 | Tailwind is wired through `turbopack.rules` in `next.config.ts`, not PostCSS |
| Tailwind CSS v4 | Utility styling with tokens in `@theme` | Tokens live in `src/app/globals.css` |
| Redux Toolkit + react-redux | Client state shared across header, menu, dialogs, dashboard | No server data → no TanStack Query |
| `next/font/google` Nunito | Rounded, friendly, has a Vietnamese subset | **Critical:** any font must include `vietnamese`; fetched at build time (needs network in CI) |
| Vitest | Fast unit tests for pure TS modules | Config is `vitest.config.mts` (ESM); `@` alias mirrors `tsconfig` |
| npm | `package-lock.json` | Use npm; CI runs `npm ci` |
| Node, pinned in `.node-version` | Same version locally (nodenv) and in CI (`setup-node`) | Upgrade rules in `workflows/workflow-node-version-management.md` |
| GitHub Actions + Pages | Build from source on push to `main` | Base path and URL come from `actions/configure-pages` |

## Gotchas

- **Critical:** `package-lock.json` must list `node_modules/@rolldown/binding-*` for every platform, or CI fails; symptoms and fix in `workflows/workflow-debugging.md`.
- `next dev` re-adds the `nextjs-agent-rules` block to `AGENTS.md`; keep it.

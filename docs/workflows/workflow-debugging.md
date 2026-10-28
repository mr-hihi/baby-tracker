# Workflow: Debugging

| Symptom | Cause | Fix |
|---|---|---|
| Vitest: "Cannot find native binding" (`rolldown`) | npm dropped the platform binding from the lockfile | Move `node_modules` + `package-lock.json` aside, `npm install`, confirm `@rolldown/binding-*` entries in the lockfile |
| `tsc` errors in `.next/types/validator.ts` | Stale route types | `npx next typegen` |
| Build error about `dynamicParams` / missing `generateStaticParams` | A dynamic route is not fully prerenderable | Add `generateStaticParams` + `dynamicParams = false` |
| Images 404 on GitHub Pages only | URL missing the base path | Wrap with `withBasePath()` |
| Hydration mismatch | Render read `localStorage`, `window` or the clock | Move it into `useEffect` / `useState` initialiser of a client component, gate on `loaded` |
| Dashboard stuck on skeleton | `babiesLoaded` never dispatched (Providers not mounted) | Page must sit under `[locale]/layout.tsx` |
| Wrong week near midnight | Local vs UTC date mix | Use `IsoDate` + `lib/date.ts` only |
| `nodenv: version '<x>' is not installed` | `.node-version` names a version nodenv lacks (it needs an exact version) | `nodenv install "$(cat .node-version)"` |

Inspect saved data: DevTools → Application → Local Storage → `baby-tracker:v1`.

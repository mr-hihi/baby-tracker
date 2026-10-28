# Baby Tracker

Follow a baby's growth day by day — from the first day of the last menstrual period, through the 40 weeks of pregnancy, up to 18 years old. Everything is stored in the browser's `localStorage`; there is no backend.

## Setup (fresh clone)

| macOS / Git Bash | Windows cmd / PowerShell |
|---|---|
| `sh run.sh setup` | `run setup` |

`setup` installs Node (Homebrew on macOS, winget on Windows) when missing, runs `npm ci` (installs exactly what `package-lock.json` lists, never rewrites it), and copies `.env.example` to `.env`.

## Commands

| Command | Windows | Does |
|---|---|---|
| `sh run.sh start` | `run start` | Dev server on http://localhost:4071 |
| `sh run.sh start_test` | `run start_test` | Dev server on http://localhost:5101 with `.env.test` — a separate origin, so its `localStorage` is isolated from dev data (E2E) |
| `sh run.sh test` | `run test` | Unit tests (Vitest) |
| `sh run.sh build` | `run build` | Static export into `out/` |

## Environment

| Key | Meaning |
|---|---|
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Language used when the visitor has no saved choice and the browser language is neither `vi` nor `en` |
| `NEXT_PUBLIC_SITE_URL` | Absolute site URL (canonical links, sitemap, Open Graph), including the base path |
| `NEXT_PUBLIC_BASE_PATH` | Sub-path the site is served under (`/baby-tracker` on a GitHub project page, empty locally) |

Next.js loads `.env.local` then `.env`; under `NODE_ENV=test` (`start_test`) it loads `.env.test` then `.env` and skips `.env.local`. `.env.stg` / `.env.prod` are local-only notes of the hosted values — the GitHub Pages workflow sets them itself. Only `.env.example` is committed.

## Deploy — GitHub Pages

The site is a pure static export, so it needs no server.

1. Push the repository to GitHub.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main`. `.github/workflows/deploy.yml` builds the site and publishes `out/` to `https://<user>.github.io/<repo>/`. The base path and site URL come from `actions/configure-pages`, so no secret or manual value is needed.

## Docs

- [AGENTS.md](AGENTS.md) — entry for AI agents and contributors; the full doc hub is [docs/README.md](docs/README.md).
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — rendering model, routes, growth rules, images, i18n, SEO, base path.

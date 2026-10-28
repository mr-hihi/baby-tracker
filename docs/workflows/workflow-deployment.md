# Workflow: Deployment (GitHub Pages)

1. Once per repo: GitHub → **Settings → Pages → Source: GitHub Actions**.
2. Push to `main` (or run the workflow by hand). `.github/workflows/deploy.yml`:
   `npm ci` → `npm test` → `npm run build` with env from `actions/configure-pages` → upload `out/` → deploy.
3. Site: `https://mr-hihi.github.io/baby-tracker/`.

- **Critical:** `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_SITE_URL` come from `configure-pages` outputs (`base_path`, `base_url`); never hardcode them in the workflow.
- A custom domain changes `base_path` to empty automatically; nothing else to edit.
- `public/.nojekyll` must stay — it keeps folders starting with `_` (`_next/`) published on branch-based Pages.
- `.env.stg` / `.env.prod` are local-only, git-ignored notes of the hosted values; Next.js does not load them and CI does not need them.

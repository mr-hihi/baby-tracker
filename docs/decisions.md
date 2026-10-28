# Decisions

| Decision | Why | Guardrail |
|---|---|---|
| Frontend only, data in `localStorage` | Product requirement: no account, no backend | Don't add an API or server feature; keep the app working offline once loaded |
| Static export to GitHub Pages | Hosting without a Linux server, built from the git source | Every route prerenderable (rules in `ARCHITECTURE.md` → Routes); no `cacheComponents` |
| Locale in the URL (`/vi/`, `/en/`) | SEO: one indexable URL per language with `hreflang` | Don't switch language by state only; keep `switchLocaleInPath` mapping 1:1 |
| `/` is a language chooser with a client redirect | Static hosting has no server redirect; it is the home page's `x-default` | Keep visible links to both locales on `/` for crawlers |
| Birth date is estimated, not entered (rule in `project-overview.md` → Business rules) | Requirement: a baby has only name, last period date, gender | Don't add a birth-date field without updating the product rules and `timeline.test.ts` |
| Week numbering as in `ARCHITECTURE.md` → Growth model | Makes weeks 1–40 all reachable and the due date age 0 | Change only together with `timeline.test.ts` |
| Redux only for state shared across the layout (ownership in `state-management.md`) | Header, menu, dialogs and dashboard share babies | Keep per-view state local |
| Storage key `baby-tracker:v1` | Lets a future shape change migrate from `v1` | A breaking shape change gets a new key + a migration in `persistence.ts` |
| Native `<dialog>` and `popover` | Focus trap, Esc, backdrop and light-dismiss for free | Don't replace with a hand-made overlay |
| Illustrations generated as SVG | No licensed photos yet; small and sharp | Real images must keep the file names and aspect ratios in `ARCHITECTURE.md` → Images |
| Growth figures are reference tables | No personal measurements are stored | Always show the disclaimer; label figures as reference |
| Hand-rolled form (`FormData` + `validateBabyForm`) | One small form; a forms library adds weight for nothing | Add a forms library only when a second non-trivial form appears |

# Architecture

## Rendering model

- **Critical:** `output: "export"` — `next build` prerenders every route to `out/` as HTML; there is no server at runtime.
- Server Components run only at build time. Client state (babies) exists only in the browser.
- Flow on page load:

```
static HTML (prerendered, no baby data)
  → hydrate → Providers useEffect → readSavedBabies(localStorage) → babiesLoaded
  → BabyDashboard: skeleton → empty state | baby overview
  → every babies change → store.subscribe → writeSavedBabies(localStorage)
```

## Routes

| Route | File | Notes |
|---|---|---|
| `/` | `src/app/(root)/page.tsx` | Language chooser; `LanguageRedirect` sends the visitor to the saved / browser / default locale. Own root layout. |
| `/{vi,en}/` | `src/app/[locale]/page.tsx` | Baby dashboard + journey index |
| `/{locale}/week/{1..40}/` | `src/app/[locale]/week/[week]/page.tsx` | Static guide per pregnancy week |
| `/{locale}/month/{0..24}/` | `src/app/[locale]/month/[month]/page.tsx` | Static guide per month after birth, boy / girl comparison; not on the timeline |
| `/{locale}/age/{0..18}/` | `src/app/[locale]/age/[age]/page.tsx` | Static guide per year, boy / girl comparison |
| `/{locale}/vaccines/` | `src/app/[locale]/vaccines/page.tsx` | Static vaccination schedule; the selected baby's status after hydrate |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/icon.svg` | `src/app/*.ts`, `src/app/icon.svg` | Metadata routes, `dynamic = "force-static"` |

- **Critical:** every dynamic segment has `generateStaticParams()` and `dynamicParams = false`.
- **Critical:** `trailingSlash: true` — every internal path ends in `/` (`/vi/week/3/` → `out/vi/week/3/index.html`). Path helpers (`localePath`, `weekPath`, `agePath`) and path comparisons (`useReturnHome`) follow it; a new helper must too.
- Two root layouts (`(root)` and `[locale]`): moving between `/` and `/{locale}/` is a full page load; `<html lang>` comes from the locale layout.
- Header, menu and dialogs live in `[locale]/layout.tsx`, so they exist on every locale page.

## Growth model (`src/features/growth/`)

| Module | Responsibility |
|---|---|
| `steps.ts` | One timeline: weeks 1–40 then ages 0–18 (59 steps); next / previous cross from week 40 to age 0; `stepWindow` shows 5 steps of one kind |
| `timeline.ts` | `growthProgress(lastPeriodDate, today)` → pregnancy (weeks + days, due date) or born (age span); `stepForProgress` |
| `pregnancy-weeks.ts` | Week table: fruit (weeks 4–40), length, weight in grams, heart rate |
| `childhood-years.ts` | WHO/CDC medians per age and gender; resting heart rate bands |
| `stats.ts` | `growthStats(step, gender)`; image paths |

- **Critical:** week N covers elapsed days `7(N-1)` … `7N-1`; day 280 is age 0.
- **Critical:** month steps 0–24 are guide pages only, not on the timeline; WHO medians per month, with months 0 / 12 / 24 equal to ages 0 / 1 / 2. Rules: [business/1-baby-progress.md](business/1-baby-progress.md).
- **Critical:** lengths up to week 19 are crown–rump, from week 20 crown–heel — the jump at week 20 is real, not a bug.
- No gender → height / weight are the boy–girl average and images come from the neutral set.

## Care and vaccinations

| Module | Responsibility | Spec |
|---|---|---|
| `src/features/care/` | Static care items (supplement / eat / avoid) per week, month, age | [business/2-care-guide.md](business/2-care-guide.md) |
| `src/features/vaccinations/` | TCMR dose schedule, dose status from the baby's current point | [business/3-vaccination.md](business/3-vaccination.md) |

- Care items and the dose list "at this step" are prerendered; dose status, the overdue list and the "Given" control render only after babies load.
- Vaccination records are stored on `Baby.vaccinations` (see `state-management.md`).

## Images

| Path | Used for |
|---|---|
| `public/assets/baby/week-NN.svg` | Pregnancy weeks 01–40 |
| `public/assets/baby/age-NN.svg` | Ages 00–18, gender unknown |
| `public/assets/baby/{boy,girl}/age-NN.svg` | Ages 00–18 by gender |
| `public/assets/size/<fruit>.svg` | Size comparison, key = `Fruit` in `pregnancy-weeks.ts` |
| `public/og-image.png` | Open Graph / Twitter card (1200×630) |

Baby images are 480×360 (4:3), fruits 200×200 with a transparent background.

## i18n

- Locale is the first URL segment; `LOCALES = ["vi", "en"]`.
- Dictionaries: `src/features/locale/dictionaries/{vi,en}.ts`; `en` is typed as `Dictionary` (= `typeof vi`), so a missing key fails the typecheck.
- Server components call `getDictionary(locale)`; client components call `useLocale()`.
- The menu's language links map the current path to the other locale (`switchLocaleInPath`) and save the choice under `localStorage["baby-tracker:locale"]`.

## SEO

- Every page builds its metadata with `pageMetadata()` (`src/features/seo/metadata.ts`): title, description, canonical, `hreflang` vi / en / x-default, Open Graph, Twitter.
- JSON-LD: `WebApplication` on home, `BreadcrumbList` on guide pages.
- `sitemap.ts` expands a locale-less `paths` list over `LOCALES` with language alternates. A new route adds its locale-less path (e.g. `section/<item>/`) to `paths`.
- `x-default`: `/` for the home page, the default-locale URL for every other page (`languageAlternates`).
- `robots.txt` is only honoured at a domain root; on a GitHub project page submit the sitemap in Search Console instead.

## Environment and base path

| Key | Use |
|---|---|
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Fallback locale for `/` and `DEFAULT_LOCALE` |
| `NEXT_PUBLIC_SITE_URL` | Absolute URLs (canonical, sitemap, OG), includes the base path |
| `NEXT_PUBLIC_BASE_PATH` | `next.config.ts` `basePath`; `/baby-tracker` on GitHub Pages, empty locally |

- **Critical:** `next/link` and the router add `basePath` themselves; `next/image` and plain asset URLs do not — wrap them with `withBasePath()` (`src/lib/site.ts`).
  - ✅ `src={withBasePath(babyImagePath(step))}` ❌ `src="/assets/baby/week-01.svg"`

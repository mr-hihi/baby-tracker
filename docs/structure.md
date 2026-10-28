# Structure

```
src/
├── app/
│   ├── (root)/{layout,page}.tsx      # "/" language chooser, own root layout
│   ├── [locale]/layout.tsx           # root layout per locale: Providers, AppHeader, DialogHost
│   ├── [locale]/page.tsx             # dashboard + journey index
│   ├── [locale]/week/[week]/page.tsx # weekly guide
│   ├── [locale]/age/[age]/page.tsx   # yearly guide
│   ├── providers.tsx                 # Redux store + LocaleProvider + localStorage sync
│   ├── fonts.ts, globals.css, icon.svg, sitemap.ts, robots.ts, manifest.ts
├── components/
│   ├── atoms/        # Button, Icon, Logo, TextField, JsonLd — no app state
│   ├── molecules/    # StepSelector, StatRow, SizeBadge, Dialog, Breadcrumbs, AgeComparison
│   ├── organisms/    # GrowthCard, AppHeader, AppMenu, BabyDashboard, dialogs, JourneyIndex,
│   │                 #   LanguageChoice + LanguageRedirect ("/" chooser)
│   └── templates/    # PageShell
├── features/
│   ├── babies/       # slice, form validation, progress text
│   ├── dialogs/      # which dialog is open, useReturnHome
│   ├── growth/       # timeline, steps, data tables, stats, image paths
│   ├── locale/       # locales, dictionaries, format helpers, LocaleProvider, preference
│   └── seo/          # pageMetadata, JSON-LD builders
├── lib/              # date.ts (ISO date math), site.ts (URLs, base path, paths)
└── store/            # makeStore, typed hooks, persistence
```

## Rules

- **Critical:** domain logic (dates, growth, formatting, validation) lives in `features/*` / `lib/` as pure functions — never inside a component.
- **Critical:** `GrowthCard`, `StepSelector`, `SizeBadge`, `StatRow`, `JourneyIndex`, `AgeComparison`, `Breadcrumbs`, `PageShell` have no hooks and no `"use client"`: server guide pages render them with `navigation.mode = "link"`, the client dashboard with `mode = "state"`. Keep them hook-free.
- Components that read the store are client components (`"use client"`) at organism level. A generic molecule may be a client component only for a browser API it wraps without app state (`Dialog` → `showModal()`).
- Atoms never import from `features/` state; molecules compose atoms; organisms connect state; pages assemble.
- Tests sit next to the module: `foo.ts` → `foo.test.ts`.

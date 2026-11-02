# Structure

```
src/
├── app/
│   ├── (root)/{layout,page}.tsx      # "/" language chooser, own root layout
│   ├── [locale]/layout.tsx           # root layout per locale: Providers, AppHeader, DialogHost
│   ├── [locale]/page.tsx             # dashboard + journey index
│   ├── [locale]/week/[week]/page.tsx # weekly guide
│   ├── [locale]/month/[month]/page.tsx # monthly guide, months 0–24
│   ├── [locale]/age/[age]/page.tsx   # yearly guide
│   ├── [locale]/vaccines/page.tsx    # vaccination schedule
│   ├── [locale]/prenatal-tests/page.tsx # prenatal test schedule
│   ├── providers.tsx                 # Redux store + LocaleProvider + localStorage sync
│   ├── fonts.ts, globals.css, icon.svg, sitemap.ts, robots.ts, manifest.ts
├── components/
│   ├── atoms/        # Button, Icon, Logo, TextField, JsonLd — no app state
│   ├── molecules/    # StepSelector, StatRow, SizeBadge, Dialog, Breadcrumbs, AgeComparison,
│   │                 #   StepLinkGrid, DoseRow, TestRow, ScheduleCard, ScheduleStatusBadge
│   ├── organisms/    # GrowthCard, AppHeader, AppMenu, BabyDashboard, dialogs, JourneyIndex,
│   │                 #   MonthLinks, CareSection, VaccineSection, VaccineCard, VaccineSchedule,
│   │                 #   DoseRecordControl, PrenatalTestSection, PrenatalTestCard, PrenatalTestSchedule,
│   │                 #   TestRecordControl, ScheduleRecordControl,
│   │                 #   LanguageChoice + LanguageRedirect ("/" chooser)
│   └── templates/    # PageShell
├── features/
│   ├── babies/       # slice (incl. dose and test records), form validation, progress text
│   ├── care/         # care items table, care groups per step
│   ├── dialogs/      # which dialog is open, useReturnHome
│   ├── growth/       # timeline, steps (week / month / age), data tables, stats, image paths
│   ├── locale/       # locales, dictionaries, format helpers, LocaleProvider, preference
│   ├── prenatal-tests/ # prenatal test schedule, tests per week, test text
│   ├── schedule/     # status from the current point and record date check, shared by vaccinations and prenatal-tests
│   ├── seo/          # pageMetadata, JSON-LD builders
│   └── vaccinations/ # dose schedule, doses per step, dose text
├── lib/              # date.ts (ISO date math), site.ts (URLs, base path, paths)
└── store/            # makeStore, typed hooks, persistence
```

## Rules

- **Critical:** domain logic (dates, growth, formatting, validation) lives in `features/*` / `lib/` as pure functions — never inside a component.
- **Critical:** `GrowthCard`, `StepSelector`, `SizeBadge`, `StatRow`, `JourneyIndex`, `MonthLinks`, `StepLinkGrid`, `CareSection`, `AgeComparison`, `Breadcrumbs`, `ScheduleCard`, `PageShell` have no hooks and no `"use client"`, because server guide pages render them. Those with a `navigation` prop take `mode = "link"` on guide pages and `mode = "state"` on the client dashboard. Keep them hook-free.
- Components that read the store are client components (`"use client"`) at organism level. A generic molecule may be a client component only for a browser API it wraps without app state (`Dialog` → `showModal()`).
- Atoms never import from `features/` state; molecules compose atoms; organisms connect state; pages assemble.
- Tests sit next to the module: `foo.ts` → `foo.test.ts`.

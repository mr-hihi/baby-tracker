# Workflow: Adding a Page

1. Place it under `src/app/[locale]/…` so it gets the header, menu, dialogs and `<html lang>`.
2. Copy [template-page.md](../templates/template-page.md).
3. **Critical:** every dynamic segment: `generateStaticParams()` + `export const dynamicParams = false`; validate params and call `notFound()` on bad input.
4. Metadata through `pageMetadata({ locale, path, title, description })`; add titles / descriptions to both dictionaries.
5. Add the locale-less path to `paths` in `src/app/sitemap.ts` (it expands over every locale) and, if useful, a link from `JourneyIndex` or the menu.
6. Add JSON-LD (`breadcrumbLd`) when the page sits under a section.
7. `sh run.sh build` and check `out/<locale>/<path>/index.html` has the right `<title>`, canonical and `hreflang`.

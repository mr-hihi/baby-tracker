# Performance

- **Critical:** keep pages static — anything that needs request-time data breaks the export.
- `images.unoptimized: true` (no image server). Ship images already sized: SVG ≤ ~12 KB each, raster photos pre-compressed (WebP / AVIF ≤ ~150 KB at 960×720).
- Use `preload` (not the deprecated `priority`) only for the main image of a guide page.
- Keep heavy data (growth tables, dictionaries) as plain TS modules; both dictionaries ship to the client through `useLocale` — keep them text-only.
- Don't add a client component above `PageShell` content without need; static guide content should stay server-rendered HTML.

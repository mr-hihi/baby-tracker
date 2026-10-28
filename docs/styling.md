# Styling

## Tokens (`src/app/globals.css` → `@theme`)

| Token | Use |
|---|---|
| `page` | Page background |
| `surface` | Cards, dialogs, menu |
| `brand` | Selected step, primary button, icons |
| `brand-strong` | Text on soft brand, hover |
| `brand-soft` | Icon tiles, borders, secondary button |
| `ink` | Text |
| `muted` | Labels, secondary text |
| `line` | Dividers, input borders |
| `danger` | Form errors |
| `shadow-card` / `shadow-float` | Card / floating elements |

- **Critical:** use tokens (`bg-brand`, `text-muted`) — never raw hex in components. The only raw colours allowed are inside SVG art and `viewport.themeColor` / manifest.
- Light theme only (`color-scheme: light`); don't add `dark:` variants without a design.
- **Critical:** hand-written CSS in `globals.css` goes inside `@layer base` — unlayered rules beat every Tailwind utility class.

## Layout

- Mobile-first: one column `mx-auto max-w-md px-4`; desktop just centres it.
- **Preferred:** touch targets ≥ 40 px (`size-10` / `h-10`, buttons `py-2.5`); the main controls — step pills, step arrows, menu button — use 44 px (`size-11`).
- Large radii: cards `rounded-[2rem]`, inner blocks `rounded-3xl` / `rounded-2xl`, pills `rounded-full`.
- The size badge overlaps the image bottom (`-mt-14`) and its medallion sticks out left (`-ml-6`) — keep the card `overflow` visible.

## Typography

- Nunito via `--font-nunito` (`font-sans`). Headings `font-extrabold`, labels `text-sm text-muted`, values `text-lg font-extrabold`.

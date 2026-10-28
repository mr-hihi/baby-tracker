# Template: Component

## Hook-free (renders on server pages and in client components)

```tsx
import type { Dictionary } from "@/features/locale/dictionaries";
import { formatLength } from "@/features/locale/format";
import type { Locale } from "@/features/locale/locales";

type HeightBadgeProps = { heightCm: number; locale: Locale; dict: Dictionary };

export function HeightBadge({ heightCm, locale, dict }: HeightBadgeProps) {
  return (
    <p className="rounded-2xl bg-brand-soft px-4 py-2 text-sm font-bold text-brand-strong">
      {dict.growth.height}: {formatLength(heightCm, locale)}
    </p>
  );
}
```

## Client (reads the store or browser APIs)

```tsx
"use client";

import { selectSelectedBaby } from "@/features/babies/babiesSlice";
import { useLocale } from "@/features/locale/LocaleProvider";
import { useAppSelector } from "@/store/hooks";

export function SelectedBabyName() {
  const { dict } = useLocale();
  const baby = useAppSelector(selectSelectedBaby);
  return <span className="font-extrabold">{baby?.name ?? dict.picker.empty}</span>;
}
```

Checklist: typed props · dictionary text · tokens only · `alt` on images · `withBasePath()` on asset URLs · test for any logic moved to `features/*`.

"use client";

import Link from "next/link";
import type { Locale } from "@/features/locale/locales";
import { rememberLocale } from "@/features/locale/preference";
import { localePath } from "@/lib/site";

export function LanguageChoice({ locale, label, tagline }: { locale: Locale; label: string; tagline: string }) {
  return (
    <Link
      href={localePath(locale)}
      hrefLang={locale}
      lang={locale}
      onClick={() => rememberLocale(locale)}
      className="rounded-3xl bg-surface px-5 py-4 text-left shadow-card transition-colors hover:bg-brand-soft"
    >
      <span className="block text-lg font-extrabold text-brand-strong">{label}</span>
      <span className="block text-sm text-muted">{tagline}</span>
    </Link>
  );
}

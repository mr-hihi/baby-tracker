"use client";

import Link from "next/link";
import { Logo } from "@/components/atoms/Logo";
import { useLocale } from "@/features/locale/LocaleProvider";
import { localePath } from "@/lib/site";
import { AppMenu } from "./AppMenu";

export function AppHeader() {
  const { locale, dict } = useLocale();
  return (
    <header className="sticky top-0 z-30 bg-page/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-3">
        <Link href={localePath(locale)} className="flex items-center gap-2 text-lg font-extrabold text-ink">
          <Logo />
          {dict.appName}
        </Link>
        <AppMenu />
      </div>
    </header>
  );
}

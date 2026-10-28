"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "@/features/locale/LocaleProvider";
import { localePath } from "@/lib/site";

export function useReturnHome() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useLocale();
  return () => {
    const home = localePath(locale);
    if (`${pathname.replace(/\/+$/, "")}/` !== home) router.push(home);
  };
}

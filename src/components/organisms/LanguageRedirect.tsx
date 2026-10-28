"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { preferredLocale } from "@/features/locale/preference";
import { localePath } from "@/lib/site";

export function LanguageRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace(localePath(preferredLocale()));
  }, [router]);
  return null;
}

import type { MetadataRoute } from "next";
import { getDictionary } from "@/features/locale/dictionaries";
import { DEFAULT_LOCALE } from "@/features/locale/locales";
import { withBasePath } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const dict = getDictionary(DEFAULT_LOCALE);
  return {
    name: dict.appName,
    short_name: dict.appName,
    description: dict.tagline,
    start_url: withBasePath("/"),
    scope: withBasePath("/"),
    display: "standalone",
    background_color: "#f1faf8",
    theme_color: "#12a08c",
    icons: [{ src: withBasePath("/icon.svg"), sizes: "any", type: "image/svg+xml" }],
  };
}

import type { Metadata, Viewport } from "next";
import { DEFAULT_LOCALE } from "@/features/locale/locales";
import { absoluteUrl, languageAlternates, SITE_URL } from "@/lib/site";
import { getDictionary } from "@/features/locale/dictionaries";
import { nunito } from "../fonts";
import "../globals.css";

const dict = getDictionary(DEFAULT_LOCALE);

export const viewport: Viewport = { themeColor: "#12a08c" };

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: dict.meta.chooserTitle,
  description: `${getDictionary("vi").tagline}. ${getDictionary("en").tagline}.`,
  alternates: { canonical: absoluteUrl("/"), languages: languageAlternates() },
};

export default function ChooserLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={DEFAULT_LOCALE} className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}

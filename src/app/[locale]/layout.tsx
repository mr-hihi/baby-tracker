import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/organisms/AppHeader";
import { DialogHost } from "@/components/organisms/DialogHost";
import { getDictionary } from "@/features/locale/dictionaries";
import { isLocale, LOCALES } from "@/features/locale/locales";
import { SITE_URL } from "@/lib/site";
import { nunito } from "../fonts";
import "../globals.css";
import { Providers } from "../providers";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: "#12a08c" };

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(`${SITE_URL}/`),
    applicationName: dict.appName,
    title: { default: dict.meta.homeTitle, template: `%s · ${dict.appName}` },
    description: dict.meta.homeDescription,
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <Providers locale={locale}>
          <AppHeader />
          {children}
          <DialogHost />
        </Providers>
      </body>
    </html>
  );
}

import { LanguageChoice } from "@/components/organisms/LanguageChoice";
import { LanguageRedirect } from "@/components/organisms/LanguageRedirect";
import { Logo } from "@/components/atoms/Logo";
import { getDictionary } from "@/features/locale/dictionaries";
import { LOCALES } from "@/features/locale/locales";

export default function ChooserPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-6 px-4 text-center">
      <LanguageRedirect />
      <Logo className="size-20" />
      <h1 className="text-2xl font-extrabold">
        {getDictionary("vi").appName}
        <span className="block text-lg text-muted">{getDictionary("en").appName}</span>
      </h1>
      <div className="flex w-full flex-col gap-3">
        {LOCALES.map((locale) => {
          const dict = getDictionary(locale);
          return <LanguageChoice key={locale} locale={locale} label={dict.languages[locale]} tagline={dict.tagline} />;
        })}
      </div>
    </main>
  );
}

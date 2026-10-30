import Link from "next/link";

const PILL =
  "grid h-10 place-items-center rounded-xl bg-surface text-sm font-bold text-ink shadow-sm transition-colors hover:bg-brand hover:text-white";

export type StepLink = { href: string; label: string; text: number };

export function StepLinkGrid({ id, heading, links }: { id: string; heading: string; links: StepLink[] }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="mb-3 text-lg font-extrabold">
        {heading}
      </h2>
      <ul className="grid grid-cols-8 gap-1.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} aria-label={link.label} className={PILL}>
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

import Image from "next/image";
import type { ReactNode } from "react";

export function SizeBadge({ medallion, intro, title, emphasis }: {
  medallion: ReactNode;
  intro: string;
  title: string;
  emphasis: "large" | "normal";
}) {
  return (
    <div className="relative z-10 -mt-14 flex items-center gap-2 pr-1">
      <div className="-ml-6 grid size-28 shrink-0 place-items-center rounded-full bg-surface shadow-float ring-4 ring-surface">
        {medallion}
      </div>
      <div className="mt-8 min-w-0 flex-1 rounded-2xl bg-surface px-4 py-3 text-right shadow-float">
        <p className="text-sm text-muted">{intro}</p>
        <p className={emphasis === "large" ? "text-2xl leading-tight font-extrabold" : "text-base leading-snug font-bold"}>
          {title}
        </p>
      </div>
    </div>
  );
}

export function FruitMedallion({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} width={200} height={200} className="size-24" />;
}

export function AgeMedallion({ age, label }: { age: number; label: string }) {
  return (
    <div className="flex flex-col items-center leading-none">
      <span className="text-xs font-bold text-muted">{label}</span>
      <span className="text-5xl font-extrabold text-brand">{age}</span>
    </div>
  );
}

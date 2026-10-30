"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { Button, buttonClass } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { selectBabiesLoaded, selectSelectedBaby, type Baby } from "@/features/babies/babiesSlice";
import { describeProgress } from "@/features/babies/describeProgress";
import { dialogOpened } from "@/features/dialogs/dialogSlice";
import { isSameStep, type GrowthStep } from "@/features/growth/steps";
import { currentPointForProgress, growthProgress, stepForProgress } from "@/features/growth/timeline";
import { useLocale } from "@/features/locale/LocaleProvider";
import { todayIso } from "@/lib/date";
import { localePath, stepPath, withBasePath } from "@/lib/site";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { GrowthCard } from "./GrowthCard";
import { VaccineCard } from "./VaccineCard";

function DashboardSkeleton({ label }: { label: string }) {
  return (
    <div aria-busy="true" className="animate-pulse rounded-[2rem] bg-surface p-5 shadow-card">
      <span className="sr-only">{label}</span>
      <div className="mx-auto h-5 w-24 rounded-full bg-brand-soft" />
      <div className="mt-4 aspect-[4/3] rounded-3xl bg-brand-soft" />
      <div className="mt-6 h-4 w-2/3 rounded-full bg-brand-soft" />
      <div className="mt-3 h-4 w-1/2 rounded-full bg-brand-soft" />
    </div>
  );
}

function EmptyState() {
  const { dict } = useLocale();
  const dispatch = useAppDispatch();
  return (
    <section className="overflow-hidden rounded-[2rem] bg-surface text-center shadow-card">
      <Image
        src={withBasePath("/assets/baby/week-20.svg")}
        alt=""
        width={480}
        height={360}
        className="aspect-[4/3] w-full object-cover"
      />
      <div className="p-6">
        <h2 className="text-2xl font-extrabold">{dict.dashboard.emptyTitle}</h2>
        <p className="mt-2 text-muted">{dict.dashboard.emptyBody}</p>
        <Button className="mt-5" onClick={() => dispatch(dialogOpened("add-baby"))}>
          <Icon name="plus" />
          {dict.menu.addBaby}
        </Button>
      </div>
    </section>
  );
}

function BabyOverview({ baby }: { baby: Baby }) {
  const { locale, dict } = useLocale();
  const [today] = useState(todayIso);
  const progress = growthProgress(baby.lastPeriodDate, today);
  const currentStep = stepForProgress(progress);
  const [selected, setSelected] = useState<GrowthStep>(currentStep);
  const { headline, details } = describeProgress(progress, locale, dict);
  const detailsPath = stepPath(selected);
  const showGender = progress.stage === "born" ? baby.gender : undefined;
  const headingId = useId();

  return (
    <section aria-labelledby={headingId}>
      <div className="mb-4 px-1">
        <h2 id={headingId} className="flex items-center gap-2 text-2xl font-extrabold">
          {baby.name}
          {baby.gender && (
            <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand-strong">
              {dict.gender[baby.gender]}
            </span>
          )}
        </h2>
        <p className="text-lg font-extrabold text-brand-strong">{headline}</p>
        {details.map((line) => (
          <p key={line} className="text-sm text-muted">
            {line}
          </p>
        ))}
      </div>
      <GrowthCard
        step={selected}
        currentStep={currentStep}
        gender={showGender}
        locale={locale}
        navigation={{ mode: "state", onSelect: setSelected }}
      >
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {!isSameStep(selected, currentStep) && (
            <Button variant="secondary" onClick={() => setSelected(currentStep)}>
              <Icon name="calendar" />
              {dict.dashboard.backToToday}
            </Button>
          )}
          <Link href={localePath(locale, detailsPath)} className={buttonClass("ghost")}>
            {dict.dashboard.viewDetails}
            <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>
      </GrowthCard>
      <VaccineCard baby={baby} point={currentPointForProgress(progress)} today={today} />
    </section>
  );
}

export function BabyDashboard() {
  const { dict } = useLocale();
  const loaded = useAppSelector(selectBabiesLoaded);
  const baby = useAppSelector(selectSelectedBaby);
  if (!loaded) return <DashboardSkeleton label={dict.dashboard.loading} />;
  if (!baby) return <EmptyState />;
  return <BabyOverview key={`${baby.id}:${baby.lastPeriodDate}`} baby={baby} />;
}

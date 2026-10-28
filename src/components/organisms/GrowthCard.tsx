import Image from "next/image";
import type { ReactNode } from "react";
import { Icon } from "@/components/atoms/Icon";
import { AgeMedallion, FruitMedallion, SizeBadge } from "@/components/molecules/SizeBadge";
import { StatRow } from "@/components/molecules/StatRow";
import { StepSelector, type StepNavigation } from "@/components/molecules/StepSelector";
import type { Gender } from "@/features/growth/childhood-years";
import { babyImagePath, fruitImagePath, growthStats } from "@/features/growth/stats";
import type { GrowthStep } from "@/features/growth/steps";
import { getDictionary } from "@/features/locale/dictionaries";
import { fill, formatBeatRange, formatLength, formatWeight } from "@/features/locale/format";
import type { Locale } from "@/features/locale/locales";
import { withBasePath } from "@/lib/site";

type GrowthCardProps = {
  step: GrowthStep;
  locale: Locale;
  navigation: StepNavigation;
  currentStep?: GrowthStep;
  gender?: Gender;
  preloadImage?: boolean;
  children?: ReactNode;
};

export function GrowthCard({ step, locale, navigation, currentStep, gender, preloadImage, children }: GrowthCardProps) {
  const dict = getDictionary(locale);
  const { growth } = dict;
  const stats = growthStats(step, gender);
  const isWeek = step.kind === "week";
  const imageAlt = isWeek
    ? fill(growth.weekImageAlt, { week: step.value })
    : fill(growth.ageImageAlt, { age: step.value });
  const missing = growth.notYet;

  return (
    <article className="rounded-[2rem] bg-surface p-4 shadow-card sm:p-5">
      <StepSelector step={step} currentStep={currentStep} navigation={navigation} dict={dict} />

      <div className="mt-4 overflow-hidden rounded-3xl bg-brand-soft">
        <Image
          key={`${step.kind}-${step.value}-${gender ?? "any"}`}
          src={withBasePath(babyImagePath(step, gender))}
          alt={imageAlt}
          width={480}
          height={360}
          preload={preloadImage}
          className="aspect-[4/3] w-full object-cover"
        />
      </div>

      {isWeek && stats.fruit && (
        <SizeBadge
          medallion={
            <FruitMedallion
              src={withBasePath(fruitImagePath(stats.fruit))}
              alt={fill(growth.fruitImageAlt, { fruit: dict.fruits[stats.fruit] })}
            />
          }
          intro={growth.sizeIntro}
          title={dict.fruits[stats.fruit]}
          emphasis="large"
        />
      )}
      {!isWeek && (
        <SizeBadge
          medallion={<AgeMedallion age={step.value} label={growth.ageLabel} />}
          intro={growth.milestoneIntro}
          title={dict.ageMilestones[step.value]}
          emphasis="normal"
        />
      )}

      <dl className="mt-6 grid gap-4 px-2">
        <StatRow
          icon="ruler"
          label={stats.measure === "length" ? growth.length : growth.height}
          value={stats.sizeCm === undefined ? missing : formatLength(stats.sizeCm, locale)}
        />
        <StatRow
          icon="weight"
          label={growth.weight}
          value={stats.weightG === undefined ? missing : formatWeight(stats.weightG, locale, dict)}
        />
        <StatRow
          icon="heart"
          label={growth.heartRate}
          value={stats.heartRate === undefined ? missing : formatBeatRange(stats.heartRate, dict)}
        />
      </dl>

      {isWeek && (
        <p className="mt-6 flex gap-3 rounded-2xl bg-page px-4 py-3 text-sm leading-relaxed">
          <Icon name="sparkle" className="mt-0.5 size-5 shrink-0 text-brand" />
          <span>{dict.weekNotes[step.value - 1]}</span>
        </p>
      )}

      {(stats.sizeCm !== undefined || !isWeek) && (
        <p className="mt-3 px-2 text-xs text-muted">{isWeek ? growth.lengthNote : growth.ageNote}</p>
      )}

      {children}
    </article>
  );
}

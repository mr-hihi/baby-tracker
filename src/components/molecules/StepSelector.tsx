import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/atoms/Icon";
import { isSameStep, nextStep, previousStep, stepWindow, type GrowthStep } from "@/features/growth/steps";
import type { Dictionary } from "@/features/locale/dictionaries";

export type StepNavigation =
  | { mode: "link"; hrefFor: (step: GrowthStep) => string }
  | { mode: "state"; onSelect: (step: GrowthStep) => void };

type StepSelectorProps = {
  step: GrowthStep;
  currentStep?: GrowthStep;
  navigation: StepNavigation;
  dict: Dictionary;
};

function stepLabel(step: GrowthStep, dict: Dictionary): string {
  return step.kind === "week" ? dict.growth.weekLabel : dict.growth.ageLabel;
}

function StepControl({
  target,
  navigation,
  className,
  label,
  current,
  children,
}: {
  target?: GrowthStep;
  navigation: StepNavigation;
  className: string;
  label: string;
  current?: boolean;
  children: ReactNode;
}) {
  if (!target) {
    return (
      <span aria-hidden="true" className={`${className} opacity-30`}>
        {children}
      </span>
    );
  }
  const ariaCurrent = current ? "step" : undefined;
  if (navigation.mode === "link") {
    return (
      <Link href={navigation.hrefFor(target)} aria-label={label} aria-current={ariaCurrent} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={ariaCurrent}
      onClick={() => navigation.onSelect(target)}
      className={className}
    >
      {children}
    </button>
  );
}

const ARROW =
  "grid size-11 shrink-0 place-items-center rounded-2xl border-2 border-brand-soft text-brand transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-brand";

export function StepSelector({ step, currentStep, navigation, dict }: StepSelectorProps) {
  const previous = previousStep(step);
  const next = nextStep(step);
  return (
    <nav aria-label={stepLabel(step, dict)}>
      <p className="text-center text-base font-extrabold text-ink">{stepLabel(step, dict)}</p>
      <div className="mt-2 flex items-center justify-between gap-1">
        <StepControl
          target={previous}
          navigation={navigation}
          className={ARROW}
          label={previous ? `${dict.growth.previous}: ${stepLabel(previous, dict)} ${previous.value}` : ""}
        >
          <Icon name="chevronLeft" />
        </StepControl>
        <ol className="flex flex-1 items-center justify-center gap-0.5 sm:gap-1">
          {stepWindow(step).map((candidate) => {
            const selected = isSameStep(candidate, step);
            const isToday = currentStep !== undefined && isSameStep(candidate, currentStep);
            const label = `${stepLabel(candidate, dict)} ${candidate.value}${isToday ? ` (${dict.growth.today})` : ""}`;
            return (
              <li key={candidate.value}>
                <StepControl
                  target={candidate}
                  navigation={navigation}
                  label={label}
                  current={selected}
                  className={`relative grid size-11 place-items-center rounded-full text-lg font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-brand ${
                    selected ? "bg-brand text-white shadow-card" : "text-ink hover:bg-brand-soft"
                  }`}
                >
                  {candidate.value}
                  {isToday && (
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-1 size-1.5 rounded-full ${selected ? "bg-white" : "bg-brand"}`}
                    />
                  )}
                </StepControl>
              </li>
            );
          })}
        </ol>
        <StepControl
          target={next}
          navigation={navigation}
          className={ARROW}
          label={next ? `${dict.growth.next}: ${stepLabel(next, dict)} ${next.value}` : ""}
        >
          <Icon name="chevronRight" />
        </StepControl>
      </div>
    </nav>
  );
}

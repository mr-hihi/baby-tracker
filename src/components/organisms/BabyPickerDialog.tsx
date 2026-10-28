"use client";

import { useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { Dialog } from "@/components/molecules/Dialog";
import { babySelected, selectBabies, selectSelectedBaby } from "@/features/babies/babiesSlice";
import { describeProgress } from "@/features/babies/describeProgress";
import { dialogClosed } from "@/features/dialogs/dialogSlice";
import { useReturnHome } from "@/features/dialogs/useReturnHome";
import { growthProgress } from "@/features/growth/timeline";
import { useLocale } from "@/features/locale/LocaleProvider";
import { todayIso } from "@/lib/date";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function BabyPickerDialog() {
  const { locale, dict } = useLocale();
  const dispatch = useAppDispatch();
  const babies = useAppSelector(selectBabies);
  const selected = useAppSelector(selectSelectedBaby);
  const returnHome = useReturnHome();
  const [today] = useState(todayIso);
  const close = () => dispatch(dialogClosed());

  return (
    <Dialog title={dict.picker.title} closeLabel={dict.menu.close} onClose={close}>
      {babies.length === 0 ? (
        <p className="text-muted">{dict.picker.empty}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {babies.map((baby) => {
            const isSelected = baby.id === selected?.id;
            const { headline } = describeProgress(growthProgress(baby.lastPeriodDate, today), locale, dict);
            return (
              <li key={baby.id}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    dispatch(babySelected(baby.id));
                    close();
                    returnHome();
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors ${
                    isSelected ? "border-brand bg-brand-soft" : "border-line hover:bg-page"
                  }`}
                >
                  <span>
                    <span className="block font-extrabold">{baby.name}</span>
                    <span className="block text-sm text-muted">
                      {baby.gender ? `${dict.gender[baby.gender]} · ` : ""}
                      {headline}
                    </span>
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-xs font-bold text-brand-strong">
                      <Icon name="check" className="size-4" />
                      {dict.picker.selected}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Dialog>
  );
}

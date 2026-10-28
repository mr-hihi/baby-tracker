"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import { TextField } from "@/components/atoms/TextField";
import { Dialog } from "@/components/molecules/Dialog";
import { babyAdded, babyUpdated, selectSelectedBaby } from "@/features/babies/babiesSlice";
import { createBabyId, NAME_MAX_LENGTH, validateBabyForm, type BabyFormErrors } from "@/features/babies/babyForm";
import { dialogClosed } from "@/features/dialogs/dialogSlice";
import { useReturnHome } from "@/features/dialogs/useReturnHome";
import { useLocale } from "@/features/locale/LocaleProvider";
import { todayIso } from "@/lib/date";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function BabyFormDialog({ mode }: { mode: "add" | "edit" }) {
  const { dict } = useLocale();
  const dispatch = useAppDispatch();
  const selected = useAppSelector(selectSelectedBaby);
  const returnHome = useReturnHome();
  const [today] = useState(todayIso);
  const [errors, setErrors] = useState<BabyFormErrors>({});
  const editing = mode === "edit" ? selected : undefined;
  const { form } = dict;
  const close = () => dispatch(dialogClosed());

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = validateBabyForm(
      {
        name: String(data.get("name") ?? ""),
        lastPeriodDate: String(data.get("lastPeriodDate") ?? ""),
        gender: String(data.get("gender") ?? ""),
      },
      today,
    );
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    if (editing) dispatch(babyUpdated({ id: editing.id, ...result.baby }));
    else dispatch(babyAdded({ id: createBabyId(), ...result.baby }));
    close();
    returnHome();
  }

  const genderOptions = [
    { value: "boy", label: dict.gender.boy },
    { value: "girl", label: dict.gender.girl },
    { value: "", label: form.genderUnknown },
  ];

  return (
    <Dialog title={editing ? form.editTitle : form.addTitle} closeLabel={form.cancel} onClose={close}>
      <form
        noValidate
        onSubmit={submit}
        onChange={(event) => {
          const field = (event.nativeEvent.target as HTMLInputElement | null)?.name ?? "";
          if (field in errors) setErrors((current) => ({ ...current, [field]: undefined }));
        }}
        className="flex flex-col gap-5"
      >
        <TextField
          id="baby-form-name"
          name="name"
          label={form.name}
          placeholder={form.namePlaceholder}
          defaultValue={editing?.name}
          maxLength={NAME_MAX_LENGTH}
          autoComplete="off"
          autoFocus
          required
          error={errors.name && form[errors.name]}
        />
        <TextField
          id="baby-form-last-period"
          name="lastPeriodDate"
          type="date"
          label={form.lastPeriodDate}
          hint={form.lastPeriodHint}
          defaultValue={editing?.lastPeriodDate}
          max={today}
          required
          error={errors.lastPeriodDate && form[errors.lastPeriodDate]}
        />
        <fieldset>
          <legend className="text-sm font-bold">
            {form.gender} <span className="font-normal text-muted">({form.optional})</span>
          </legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {genderOptions.map((option) => (
              <label
                key={option.value}
                className="cursor-pointer rounded-2xl border-2 border-line px-2 py-2.5 text-center text-sm font-bold transition-colors has-checked:border-brand has-checked:bg-brand-soft has-checked:text-brand-strong has-focus-visible:outline-2 has-focus-visible:outline-brand"
              >
                <input
                  type="radio"
                  name="gender"
                  value={option.value}
                  defaultChecked={(editing?.gender ?? "") === option.value}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={close}>
            {form.cancel}
          </Button>
          <Button type="submit">{form.save}</Button>
        </div>
      </form>
    </Dialog>
  );
}

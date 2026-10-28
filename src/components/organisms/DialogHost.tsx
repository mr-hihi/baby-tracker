"use client";

import { selectOpenDialog } from "@/features/dialogs/dialogSlice";
import { useAppSelector } from "@/store/hooks";
import { BabyFormDialog } from "./BabyFormDialog";
import { BabyPickerDialog } from "./BabyPickerDialog";

export function DialogHost() {
  const open = useAppSelector(selectOpenDialog);
  if (open === "add-baby") return <BabyFormDialog mode="add" />;
  if (open === "edit-baby") return <BabyFormDialog mode="edit" />;
  if (open === "choose-baby") return <BabyPickerDialog />;
  return null;
}

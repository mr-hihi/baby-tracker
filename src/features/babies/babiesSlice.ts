import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Gender } from "@/features/growth/childhood-years";
import type { VaccinationRecord, VaccineDoseId } from "@/features/vaccinations/vaccine-doses";
import type { IsoDate } from "@/lib/date";

export type Baby = {
  id: string;
  name: string;
  lastPeriodDate: IsoDate;
  gender?: Gender;
  vaccinations?: VaccinationRecord;
};

type DoseRecordInput = { babyId: string; doseId: VaccineDoseId };

export type SavedBabies = { items: Baby[]; selectedId: string | null };

type BabiesState = SavedBabies & { loaded: boolean };

const initialState: BabiesState = { items: [], selectedId: null, loaded: false };

export const babiesSlice = createSlice({
  name: "babies",
  initialState,
  reducers: {
    babiesLoaded(state, action: PayloadAction<SavedBabies>) {
      state.items = action.payload.items;
      state.selectedId = action.payload.selectedId;
      state.loaded = true;
    },
    babyAdded(state, action: PayloadAction<Baby>) {
      state.items.push(action.payload);
      state.selectedId = action.payload.id;
    },
    babyUpdated(state, action: PayloadAction<Omit<Baby, "vaccinations">>) {
      const index = state.items.findIndex((baby) => baby.id === action.payload.id);
      if (index < 0) return;
      const { vaccinations } = state.items[index];
      state.items[index] = { ...action.payload, ...(vaccinations && { vaccinations }) };
    },
    babySelected(state, action: PayloadAction<string>) {
      state.selectedId = action.payload;
    },
    doseRecorded(state, action: PayloadAction<DoseRecordInput & { date: IsoDate }>) {
      const { babyId, doseId, date } = action.payload;
      const baby = state.items.find((candidate) => candidate.id === babyId);
      if (baby) baby.vaccinations = { ...baby.vaccinations, [doseId]: date };
    },
    doseRecordRemoved(state, action: PayloadAction<DoseRecordInput>) {
      const { babyId, doseId } = action.payload;
      const baby = state.items.find((candidate) => candidate.id === babyId);
      if (baby?.vaccinations) delete baby.vaccinations[doseId];
    },
  },
  selectors: {
    selectBabies: (state) => state.items,
    selectBabiesLoaded: (state) => state.loaded,
    selectSelectedBaby: (state) =>
      state.items.find((baby) => baby.id === state.selectedId) ?? state.items[0],
  },
});

export const { babiesLoaded, babyAdded, babyUpdated, babySelected, doseRecorded, doseRecordRemoved } =
  babiesSlice.actions;
export const { selectBabies, selectBabiesLoaded, selectSelectedBaby } = babiesSlice.selectors;

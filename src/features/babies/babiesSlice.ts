import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Gender } from "@/features/growth/childhood-years";
import type { IsoDate } from "@/lib/date";

export type Baby = {
  id: string;
  name: string;
  lastPeriodDate: IsoDate;
  gender?: Gender;
};

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
    babyUpdated(state, action: PayloadAction<Baby>) {
      const index = state.items.findIndex((baby) => baby.id === action.payload.id);
      if (index >= 0) state.items[index] = action.payload;
    },
    babySelected(state, action: PayloadAction<string>) {
      state.selectedId = action.payload;
    },
  },
  selectors: {
    selectBabies: (state) => state.items,
    selectBabiesLoaded: (state) => state.loaded,
    selectSelectedBaby: (state) =>
      state.items.find((baby) => baby.id === state.selectedId) ?? state.items[0],
  },
});

export const { babiesLoaded, babyAdded, babyUpdated, babySelected } = babiesSlice.actions;
export const { selectBabies, selectBabiesLoaded, selectSelectedBaby } = babiesSlice.selectors;

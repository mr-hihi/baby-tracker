import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type DialogKind = "add-baby" | "edit-baby" | "choose-baby";

type DialogState = { open: DialogKind | null };

const initialState: DialogState = { open: null };

export const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    dialogOpened(state, action: PayloadAction<DialogKind>) {
      state.open = action.payload;
    },
    dialogClosed(state) {
      state.open = null;
    },
  },
  selectors: {
    selectOpenDialog: (state) => state.open,
  },
});

export const { dialogOpened, dialogClosed } = dialogSlice.actions;
export const { selectOpenDialog } = dialogSlice.selectors;

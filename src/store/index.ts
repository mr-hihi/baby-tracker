import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { babiesSlice } from "@/features/babies/babiesSlice";
import { dialogSlice } from "@/features/dialogs/dialogSlice";

const rootReducer = combineSlices(babiesSlice, dialogSlice);

export function makeStore() {
  return configureStore({ reducer: rootReducer });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];

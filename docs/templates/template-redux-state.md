# Template: Redux State

`src/features/<feature>/<name>Slice.ts`:

```ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ReminderState = { enabled: boolean };

const initialState: ReminderState = { enabled: false };

export const reminderSlice = createSlice({
  name: "reminder",
  initialState,
  reducers: {
    reminderToggled(state, action: PayloadAction<boolean>) {
      state.enabled = action.payload;
    },
  },
  selectors: {
    selectReminderEnabled: (state) => state.enabled,
  },
});

export const { reminderToggled } = reminderSlice.actions;
export const { selectReminderEnabled } = reminderSlice.selectors;
```

Register: `combineSlices(babiesSlice, dialogSlice, reminderSlice)` in `src/store/index.ts`.

Test (`<name>Slice.test.ts`): each reducer case and each selector branch, using `reminderSlice.reducer(undefined, action)`. Slice selectors take the root shape: `selectReminderEnabled({ reminder: state })`.

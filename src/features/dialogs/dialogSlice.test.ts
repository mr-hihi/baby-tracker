import { describe, expect, it } from "vitest";
import { dialogClosed, dialogOpened, dialogSlice, selectOpenDialog } from "./dialogSlice";

const reducer = dialogSlice.reducer;

describe("dialogSlice", () => {
  it("opens the requested dialog", () => {
    const state = reducer(undefined, dialogOpened("edit-baby"));
    expect(selectOpenDialog({ dialog: state })).toBe("edit-baby");
  });

  it("closes any open dialog", () => {
    const state = reducer(reducer(undefined, dialogOpened("add-baby")), dialogClosed());
    expect(selectOpenDialog({ dialog: state })).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import {
  babiesLoaded,
  babiesSlice,
  babyAdded,
  babySelected,
  babyUpdated,
  selectSelectedBaby,
  type Baby,
} from "./babiesSlice";

const reducer = babiesSlice.reducer;
const bong: Baby = { id: "a", name: "Bông", lastPeriodDate: "2026-04-01" };
const na: Baby = { id: "b", name: "Na", lastPeriodDate: "2020-01-01", gender: "girl" };

function stateWith(items: Baby[], selectedId: string | null) {
  return { babies: reducer(undefined, babiesLoaded({ items, selectedId })) };
}

describe("babiesSlice", () => {
  it("marks the state loaded with the saved babies", () => {
    expect(reducer(undefined, babiesLoaded({ items: [bong], selectedId: "a" }))).toEqual({
      items: [bong],
      selectedId: "a",
      loaded: true,
    });
  });

  it("selects a baby right after adding it", () => {
    const state = reducer(reducer(undefined, babyAdded(bong)), babyAdded(na));
    expect(state.selectedId).toBe("b");
    expect(state.items).toEqual([bong, na]);
  });

  it("replaces the baby with the same id on update", () => {
    const state = reducer(reducer(undefined, babyAdded(bong)), babyUpdated({ ...bong, name: "Bông Bông" }));
    expect(state.items).toEqual([{ ...bong, name: "Bông Bông" }]);
  });

  it("ignores an update for an unknown id", () => {
    const state = reducer(reducer(undefined, babyAdded(bong)), babyUpdated(na));
    expect(state.items).toEqual([bong]);
  });

  it("changes the selected id", () => {
    expect(reducer(undefined, babySelected("b")).selectedId).toBe("b");
  });
});

describe("selectSelectedBaby", () => {
  it("returns the selected baby", () => {
    expect(selectSelectedBaby(stateWith([bong, na], "b"))).toEqual(na);
  });

  it("falls back to the first baby when the selected id is gone", () => {
    expect(selectSelectedBaby(stateWith([bong, na], "zzz"))).toEqual(bong);
  });

  it("is undefined when there is no baby", () => {
    expect(selectSelectedBaby(stateWith([], null))).toBeUndefined();
  });
});

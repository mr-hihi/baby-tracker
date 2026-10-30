import { describe, expect, it } from "vitest";
import {
  babiesLoaded,
  babiesSlice,
  babyAdded,
  babySelected,
  babyUpdated,
  doseRecorded,
  doseRecordRemoved,
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

  it("keeps the recorded doses when the baby is edited", () => {
    const recorded = reducer(
      reducer(undefined, babyAdded(bong)),
      doseRecorded({ babyId: "a", doseId: "bcg", date: "2027-01-07" }),
    );
    const state = reducer(recorded, babyUpdated({ ...bong, name: "Bông Bông" }));
    expect(state.items).toEqual([{ ...bong, name: "Bông Bông", vaccinations: { bcg: "2027-01-07" } }]);
  });

  it("adds no vaccinations field when the edited baby has none", () => {
    const state = reducer(reducer(undefined, babyAdded(bong)), babyUpdated({ ...bong, name: "Bông Bông" }));
    expect(state.items[0]).not.toHaveProperty("vaccinations");
  });
});

describe("doseRecorded", () => {
  it("stores the date under the dose id", () => {
    const state = reducer(
      reducer(undefined, babyAdded(bong)),
      doseRecorded({ babyId: "a", doseId: "bcg", date: "2027-01-07" }),
    );
    expect(state.items[0].vaccinations).toEqual({ bcg: "2027-01-07" });
  });

  it("keeps the other doses and replaces the date of the same dose", () => {
    let state = reducer(undefined, babyAdded(bong));
    state = reducer(state, doseRecorded({ babyId: "a", doseId: "bcg", date: "2027-01-07" }));
    state = reducer(state, doseRecorded({ babyId: "a", doseId: "opv-1", date: "2027-03-08" }));
    state = reducer(state, doseRecorded({ babyId: "a", doseId: "bcg", date: "2027-01-09" }));
    expect(state.items[0].vaccinations).toEqual({ bcg: "2027-01-09", "opv-1": "2027-03-08" });
  });

  it("records for the baby with the given id only", () => {
    let state = reducer(reducer(undefined, babyAdded(bong)), babyAdded(na));
    state = reducer(state, doseRecorded({ babyId: "b", doseId: "bcg", date: "2027-01-07" }));
    expect(state.items[0]).not.toHaveProperty("vaccinations");
    expect(state.items[1].vaccinations).toEqual({ bcg: "2027-01-07" });
  });

  it("ignores an unknown baby", () => {
    const state = reducer(
      reducer(undefined, babyAdded(bong)),
      doseRecorded({ babyId: "zzz", doseId: "bcg", date: "2027-01-07" }),
    );
    expect(state.items).toEqual([bong]);
  });
});

describe("doseRecordRemoved", () => {
  it("removes only the given dose", () => {
    let state = reducer(undefined, babyAdded(bong));
    state = reducer(state, doseRecorded({ babyId: "a", doseId: "bcg", date: "2027-01-07" }));
    state = reducer(state, doseRecorded({ babyId: "a", doseId: "opv-1", date: "2027-03-08" }));
    state = reducer(state, doseRecordRemoved({ babyId: "a", doseId: "bcg" }));
    expect(state.items[0].vaccinations).toEqual({ "opv-1": "2027-03-08" });
  });

  it("does nothing for a baby with no record", () => {
    const state = reducer(reducer(undefined, babyAdded(bong)), doseRecordRemoved({ babyId: "a", doseId: "bcg" }));
    expect(state.items).toEqual([bong]);
  });

  it("does nothing for an unknown baby", () => {
    const state = reducer(reducer(undefined, babyAdded(bong)), doseRecordRemoved({ babyId: "zzz", doseId: "bcg" }));
    expect(state.items).toEqual([bong]);
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

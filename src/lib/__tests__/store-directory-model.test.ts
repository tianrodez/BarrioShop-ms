import { describe, expect, it } from "vitest";
import {
  applyDirectoryFilters,
  collectStoreTypeOptions,
  EMPTY_DIRECTORY_FILTERS,
  hasActiveDirectoryFilters,
  type DirectoryStore,
} from "@/lib/store-directory-model";

function makeStore(overrides: Partial<DirectoryStore> = {}): DirectoryStore {
  return {
    id: "store-1",
    name: "Panadería La Espiga",
    store_type: "Panadería",
    barrio: "Castilla",
    address: "Cra 72 #15-20",
    reference_place: "Frente al parque de Castilla",
    opening_hours: "Lun a Sáb 6:00-13:00",
    photo_url: null,
    latitude: 4.5996,
    longitude: -74.1377,
    ...overrides,
  };
}

describe("applyDirectoryFilters (HU04 CA2-CA3)", () => {
  const rows = [
    makeStore(),
    makeStore({
      id: "store-2",
      name: "Fruver El Campo",
      store_type: "Fruver",
      barrio: "Tintal",
      reference_place: null,
    }),
    makeStore({
      id: "store-3",
      name: "Droguería Vital",
      store_type: "Droguería",
      barrio: "Bavaria",
      reference_place: null,
    }),
  ];

  it("keeps every published store with no filters", () => {
    expect(
      applyDirectoryFilters(rows, EMPTY_DIRECTORY_FILTERS).map((row) => row.id),
    ).toEqual(["store-1", "store-2", "store-3"]);
  });

  it("filters by barrio and keeps the order it received", () => {
    const filtered = applyDirectoryFilters(rows, {
      ...EMPTY_DIRECTORY_FILTERS,
      barrio: "Tintal",
    });
    expect(filtered.map((row) => row.id)).toEqual(["store-2"]);
  });

  it("filters by free text over name, type, barrio and reference place", () => {
    expect(
      applyDirectoryFilters(rows, {
        ...EMPTY_DIRECTORY_FILTERS,
        query: "parque",
      }).map((row) => row.id),
    ).toEqual(["store-1"]);
    expect(
      applyDirectoryFilters(rows, {
        ...EMPTY_DIRECTORY_FILTERS,
        query: "  FRUVER  ",
      }).map((row) => row.id),
    ).toEqual(["store-2"]);
  });

  it("combines the category filter with text without losing the order", () => {
    expect(
      applyDirectoryFilters(
        [makeStore({ id: "a" }), makeStore({ id: "b", name: "Otra Espiga" })],
        { query: "espiga", barrio: "", storeType: "Panadería" },
      ).map((row) => row.id),
    ).toEqual(["a", "b"]);
  });

  it("returns nothing when no store matches, so the empty state can show", () => {
    expect(
      applyDirectoryFilters(rows, {
        query: "no existe",
        barrio: "Castilla",
        storeType: "",
      }),
    ).toEqual([]);
  });

  it("treats accents and case the way a neighbour types them", () => {
    expect(
      applyDirectoryFilters(rows, {
        ...EMPTY_DIRECTORY_FILTERS,
        query: "panaderia",
      }).map((row) => row.id),
    ).toEqual(["store-1"]);
  });
});

describe("hasActiveDirectoryFilters", () => {
  it("is false for the untouched filter bar", () => {
    expect(hasActiveDirectoryFilters(EMPTY_DIRECTORY_FILTERS)).toBe(false);
  });

  it("is true as soon as one filter narrows the list", () => {
    expect(
      hasActiveDirectoryFilters({
        ...EMPTY_DIRECTORY_FILTERS,
        barrio: "Tintal",
      }),
    ).toBe(true);
  });
});

describe("directory edge probes (HU04, HU05, HU10)", () => {
  const rows = [
    makeStore({
      id: "espiga",
      name: "Panadería La Espiga",
      store_type: "Panadería",
      barrio: "Kennedy Central",
    }),
    makeStore({
      id: "nearbuy",
      name: "NEARBUY",
      store_type: "Tienda",
      barrio: "Tintal",
      reference_place: null,
    }),
  ];

  it("matches a typed barrio without accents or capitals", () => {
    expect(
      applyDirectoryFilters(rows, {
        query: "",
        barrio: "kennedy central",
        storeType: "",
      }).map((row) => row.id),
    ).toEqual(["espiga"]);
  });

  it("matches a whole category and never a fragment of it", () => {
    expect(
      applyDirectoryFilters(rows, {
        query: "",
        barrio: "",
        storeType: "panaderia",
      }).map((row) => row.id),
    ).toEqual(["espiga"]);
    expect(
      applyDirectoryFilters(rows, {
        query: "",
        barrio: "",
        storeType: "Panader",
      }),
    ).toEqual([]);
  });

  it("requires every active filter to match, not just one", () => {
    expect(
      applyDirectoryFilters(rows, {
        query: "nearbuy",
        barrio: "Kennedy Central",
        storeType: "",
      }),
    ).toEqual([]);
    expect(
      applyDirectoryFilters(rows, {
        query: "nearbuy",
        barrio: "Tintal",
        storeType: "Tienda",
      }).map((row) => row.id),
    ).toEqual(["nearbuy"]);
  });

  it("treats a filter bar of only spaces as no filter at all", () => {
    expect(
      hasActiveDirectoryFilters({ query: "   ", barrio: "", storeType: "" }),
    ).toBe(false);
    expect(
      applyDirectoryFilters(rows, { query: "   ", barrio: "", storeType: "" }),
    ).toHaveLength(2);
  });


  it("lists only the categories the client can actually buy", () => {
    expect(collectStoreTypeOptions(rows)).toEqual(["Panadería", "Tienda"]);
  });
});


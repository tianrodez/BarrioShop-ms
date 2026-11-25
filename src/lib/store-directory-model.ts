/**
 * Data contract for the client-facing directory (HU04, HU05).
 *
 * `search_stores` returns the published stores; text, barrio and category
 * narrow that result in memory so the list reacts while typing.
 */
export type DirectoryStore = {
  id: string;
  name: string;
  store_type: string;
  barrio: string;
  address: string;
  reference_place: string | null;
  opening_hours: string;
  photo_url: string | null;
  latitude: number;
  longitude: number;
};

export type DirectoryFilters = {
  query: string;
  barrio: string;
  storeType: string;
};

export const EMPTY_DIRECTORY_FILTERS: DirectoryFilters = {
  query: "",
  barrio: "",
  storeType: "",
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

/**
 * HU04 CA2: the category filter, the barrio filter and the free-text search
 * keep only the stores that match all of them. The order sent by the database
 * is preserved, so the closest store stays first.
 */
export function applyDirectoryFilters(
  stores: readonly DirectoryStore[],
  filters: DirectoryFilters,
): DirectoryStore[] {
  const query = normalize(filters.query);
  const barrio = normalize(filters.barrio);
  const storeType = normalize(filters.storeType);

  return stores.filter((store) => {
    if (barrio && normalize(store.barrio) !== barrio) return false;
    if (storeType && normalize(store.store_type) !== storeType) return false;
    if (!query) return true;

    return [
      store.name,
      store.store_type,
      store.barrio,
      store.reference_place ?? "",
    ].some((field) => normalize(field).includes(query));
  });
}

/** HU04 CA3: the empty state only offers to clear filters when some are set. */
export function hasActiveDirectoryFilters(filters: DirectoryFilters): boolean {
  return Boolean(
    filters.query.trim() || filters.barrio.trim() || filters.storeType.trim(),
  );
}

/** Options for the filter bar, derived from what is actually open for sale. */
export function collectStoreTypeOptions(
  stores: readonly DirectoryStore[],
): string[] {
  return [...new Set(stores.map((store) => store.store_type))].sort((a, b) =>
    a.localeCompare(b, "es", { sensitivity: "base" }),
  );
}

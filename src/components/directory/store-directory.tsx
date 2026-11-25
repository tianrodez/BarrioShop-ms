"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StoreCard } from "@/components/stores/store-card";
import { StoreMarkersMap } from "@/components/stores/store-markers-map";
import {
  applyDirectoryFilters,
  collectStoreTypeOptions,
  EMPTY_DIRECTORY_FILTERS,
  hasActiveDirectoryFilters,
  type DirectoryFilters,
  type DirectoryStore,
} from "@/lib/store-directory-model";

type StoreDirectoryProps = {
  /** Canonical Kennedy barrio list used by the filter. */
  barrios: string[];
  /** What the server already read: the first paint needs no round trip. */
  initialStores: DirectoryStore[];
};

function sortForReading(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) =>
    a.localeCompare(b, "es", { sensitivity: "base" }),
  );
}

/**
 * The client-facing directory (HU04, HU05, HU10). Browsing it never needs an
 * account: RLS already limits every read to published stores.
 */
export function StoreDirectory({
  barrios,
  initialStores,
}: StoreDirectoryProps) {
  const [filters, setFilters] = useState<DirectoryFilters>(
    EMPTY_DIRECTORY_FILTERS,
  );

  const visibleStores = useMemo(
    () => applyDirectoryFilters(initialStores, filters),
    [initialStores, filters],
  );
  const categoryOptions = useMemo(
    () => collectStoreTypeOptions(initialStores),
    [initialStores],
  );
  const barrioOptions = useMemo(() => sortForReading(barrios), [barrios]);

  function handleBarrioChange(barrio: string) {
    setFilters((current) => ({ ...current, barrio }));
  }

  function clearFilters() {
    setFilters(EMPTY_DIRECTORY_FILTERS);
  }

  const filtersAreActive = hasActiveDirectoryFilters(filters);

  return (
    <div className="flex flex-col gap-8">
      <form
        aria-label="Filtros del directorio"
        className="grid items-end gap-4 rounded-2xl border bg-card p-5 shadow-soft sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_auto_auto]"
        onSubmit={(event) => event.preventDefault()}
        noValidate
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="directory-query">Buscar</Label>
          <Input
            id="directory-query"
            type="search"
            value={filters.query}
            placeholder="Nombre o categoría"
            onChange={(event) => {
              // Read before updating: React may run the updater during the next
              // render, when event.currentTarget is already null.
              const query = event.currentTarget.value;
              setFilters((current) => ({ ...current, query }));
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="directory-barrio">Barrio</Label>
          <select
            id="directory-barrio"
            value={filters.barrio}
            onChange={(event) => handleBarrioChange(event.currentTarget.value)}
            className="h-10 rounded-md border bg-background px-3 text-base md:text-sm"
          >
            <option value="">Todos los barrios</option>
            {barrioOptions.map((barrio) => (
              <option key={barrio} value={barrio}>
                {barrio}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="directory-category">Categoría</Label>
          <select
            id="directory-category"
            value={filters.storeType}
            onChange={(event) => {
              const storeType = event.currentTarget.value;
              setFilters((current) => ({ ...current, storeType }));
            }}
            className="h-10 rounded-md border bg-background px-3 text-base md:text-sm"
          >
            <option value="">Todas las categorías</option>
            {categoryOptions.map((storeType) => (
              <option key={storeType} value={storeType}>
                {storeType}
              </option>
            ))}
          </select>
        </div>
      </form>

      <section
        aria-labelledby="directory-map-heading"
        className="flex flex-col gap-3"
      >
        <h2 id="directory-map-heading" className="text-lg font-semibold">
          Tiendas en el mapa
        </h2>
        <div className="overflow-hidden rounded-2xl border bg-card p-2 shadow-soft">
          <StoreMarkersMap stores={visibleStores} />
        </div>
      </section>

      <section
        aria-labelledby="directory-results-heading"
        className="flex flex-col gap-4"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="directory-results-heading" className="text-lg font-semibold">
            Tiendas ({visibleStores.length})
          </h2>
          {filtersAreActive ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
            >
              Limpiar
            </Button>
          ) : null}
        </div>

        {visibleStores.length === 0 ? (
          filtersAreActive ? (
            <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed bg-card p-8">
              <p className="text-sm">
                No encontramos tiendas con esos filtros.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={clearFilters}
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed bg-card p-8 text-sm text-muted-foreground">
              Todavía no hay tiendas publicadas en BarrioShop.
            </p>
          )
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

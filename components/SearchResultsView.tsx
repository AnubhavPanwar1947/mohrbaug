"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { SearchResultCard } from "@/components/SearchResultCard";
import {
  getCatalogFilterOptions,
  getCatalogWithMeta,
  listParamsFromFilters,
  searchProductsWithMeta,
  type ApiProduct,
  type CatalogFilterOptions,
} from "@/lib/recommendationApi";
import {
  emptySearchFilters,
  formatSearchHeading,
  type SearchFilters,
  type SortOption,
} from "@/lib/searchUtils";

const PAGE_SIZE = 24;

function appendUniqueProducts(
  current: ApiProduct[],
  incoming: ApiProduct[]
): ApiProduct[] {
  if (incoming.length === 0) {
    return current;
  }

  const seen = new Set(current.map((product) => product.id));
  const merged = [...current];

  for (const product of incoming) {
    if (seen.has(product.id)) {
      continue;
    }

    seen.add(product.id);
    merged.push(product);
  }

  return merged;
}

function SearchResultSkeleton() {
  return (
    <div className="search-result-card search-result-card--skeleton" aria-hidden="true">
      <div className="search-result-card-media skeleton-block" />
      <div className="skeleton-line skeleton-line--title" />
      <div className="skeleton-line skeleton-line--short" />
      <div className="skeleton-line skeleton-line--short" />
    </div>
  );
}

export function SearchResultsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>(emptySearchFilters);
  const [sort, setSort] = useState<SortOption>("recommended");
  const [filterOptions, setFilterOptions] =
    useState<CatalogFilterOptions>({
      categories: [],
      genders: [],
      sizes: [],
      colors: [],
    });

  useEffect(() => {
    let cancelled = false;

    void getCatalogFilterOptions()
      .then((options) => {
        if (!cancelled) {
          setFilterOptions(options);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFilterOptions({
            categories: [],
            genders: [],
            sizes: [],
            colors: [],
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const loadPage = useCallback(
    async (
      requestOffset: number,
      append: boolean,
      activeFilters: SearchFilters,
      activeSort: SortOption
    ) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const listParams = listParamsFromFilters(activeFilters, activeSort, {
        limit: PAGE_SIZE,
        offset: requestOffset,
      });

      try {
        const response = query
          ? await searchProductsWithMeta(query, listParams)
          : await getCatalogWithMeta(listParams);

        setTotalCount(response.count);
        setProducts((current) =>
          append
            ? appendUniqueProducts(current, response.results)
            : response.results
        );
      } catch (loadError) {
        if (!append) {
          setProducts([]);
          setTotalCount(0);
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load search results"
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [query]
  );

  const previousQueryRef = useRef(query);
  const skipFilterReloadRef = useRef(false);

  useEffect(() => {
    if (previousQueryRef.current !== query) {
      previousQueryRef.current = query;
      skipFilterReloadRef.current = true;
      setFilters(emptySearchFilters);
      setSort("recommended");
      void loadPage(0, false, emptySearchFilters, "recommended");
      return;
    }

    if (skipFilterReloadRef.current) {
      skipFilterReloadRef.current = false;
      return;
    }

    void loadPage(0, false, filters, sort);
  }, [filters, loadPage, query, sort]);

  const loadedCount = products.length;
  const canLoadMore =
    !loading &&
    !loadingMore &&
    !error &&
    loadedCount > 0 &&
    loadedCount < totalCount;

  function updateFilter<K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function clearFilters() {
    setFilters(emptySearchFilters);
  }

  function handleLoadMore() {
    void loadPage(loadedCount, true, filters, sort);
  }

  function handleRetry() {
    void loadPage(0, false, filters, sort);
  }

  return (
    <main id="main" className="search-page search-page--with-announcement">
      <div className="search-page-inner">
        <header className="search-page-header">
          <h1 className="search-page-title">
            {loading && loadedCount === 0
              ? query
                ? "Searching…"
                : "Loading catalog…"
              : formatSearchHeading(totalCount, query)}
          </h1>
          {!loading && loadedCount > 0 && loadedCount < totalCount ? (
            <p className="search-page-subtitle">
              Showing {loadedCount.toLocaleString()} of{" "}
              {totalCount.toLocaleString()}
            </p>
          ) : null}
          {!loading && !query ? (
            <p className="search-page-subtitle">
              Browsing the full catalog. Use the header search to narrow
              results.
            </p>
          ) : null}
        </header>

        <div className="search-toolbar">
          <div className="search-filters" aria-label="Search filters">
            <label className="search-filter">
              <span className="visually-hidden">Category</span>
              <select
                value={filters.category}
                onChange={(event) =>
                  updateFilter("category", event.target.value)
                }
              >
                <option value="">Category</option>
                {filterOptions.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="search-filter">
              <span className="visually-hidden">Gender</span>
              <select
                value={filters.gender}
                onChange={(event) =>
                  updateFilter("gender", event.target.value)
                }
              >
                <option value="">Gender</option>
                {filterOptions.genders.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </label>

            <label className="search-filter">
              <span className="visually-hidden">Size</span>
              <select
                value={filters.size}
                onChange={(event) => updateFilter("size", event.target.value)}
              >
                <option value="">Size</option>
                {filterOptions.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>

            <label className="search-filter">
              <span className="visually-hidden">Color</span>
              <select
                value={filters.color}
                onChange={(event) => updateFilter("color", event.target.value)}
              >
                <option value="">Color</option>
                {filterOptions.colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </label>

            <label className="search-filter">
              <span className="visually-hidden">Price</span>
              <select
                value={filters.price}
                onChange={(event) => updateFilter("price", event.target.value)}
              >
                <option value="">Price</option>
                <option value="under-1000">Under ₹1,000</option>
                <option value="1000-3000">₹1,000 – ₹3,000</option>
                <option value="over-3000">Over ₹3,000</option>
              </select>
            </label>

            <label className="search-filter">
              <span className="visually-hidden">Stock</span>
              <select
                value={filters.stock}
                onChange={(event) => updateFilter("stock", event.target.value)}
              >
                <option value="">Stock</option>
                <option value="in">In stock</option>
                <option value="low">Low stock</option>
                <option value="out">Out of stock</option>
              </select>
            </label>

            <button
              type="button"
              className="search-clear-filters"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>

          <label className="search-sort">
            <span className="search-sort-label">Sort by</span>
            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as SortOption)
              }
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest rated</option>
            </select>
          </label>
        </div>

        {error ? (
          <div className="search-state search-state--error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={handleRetry}>
              Try again
            </button>
          </div>
        ) : null}

        {!error && loading ? (
          <ul className="search-results-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <li key={index}>
                <SearchResultSkeleton />
              </li>
            ))}
          </ul>
        ) : null}

        {!error && !loading && loadedCount === 0 ? (
          <div className="search-state search-state--empty">
            <p>
              {query
                ? "No products match your search and filters."
                : "No products match your filters."}
            </p>
            {query ? (
              <button
                type="button"
                className="search-reset-link"
                onClick={() => {
                  clearFilters();
                  router.push("/search");
                }}
              >
                Reset search
              </button>
            ) : (
              <button
                type="button"
                className="search-reset-link"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : null}

        {!error && !loading && loadedCount > 0 ? (
          <>
            <ul className="search-results-grid">
              {products.map((product, index) => (
                <li key={product.id}>
                  <SearchResultCard
                    product={product}
                    eagerImage={index < 4}
                  />
                </li>
              ))}
            </ul>

            {loadingMore ? (
              <p className="search-page-subtitle search-load-more-status">
                Loading more products…
              </p>
            ) : null}

            {canLoadMore ? (
              <div className="search-load-more-wrap">
                <button
                  type="button"
                  className="search-load-more"
                  disabled={loadingMore}
                  onClick={handleLoadMore}
                >
                  {loadingMore ? "Loading…" : "Load more"}
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </main>
  );
}

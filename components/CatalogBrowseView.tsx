"use client";

import { useCallback, useEffect, useState } from "react";

import { SearchResultCard } from "@/components/SearchResultCard";
import {
  getCatalogFilterOptions,
  getCatalogWithMeta,
  listParamsFromFilters,
  searchProductsWithMeta,
  type CatalogFilterOptions,
} from "@/lib/recommendationApi";
import {
  emptySearchFilters,
  type SearchFilters,
  type SortOption,
} from "@/lib/searchUtils";

const PAGE_SIZE = 24;

export type CatalogBrowseViewProps = {
  title: string;
  subtitle?: string;
  searchQuery?: string;
  presetGender?: string;
  presetCategory?: string;
  lockGender?: boolean;
  lockCategory?: boolean;
  defaultSort?: SortOption;
  emptyMessage?: string;
  invalidPage?: boolean;
};

function appendUniqueProducts<T extends { id: string }>(
  current: T[],
  incoming: T[]
): T[] {
  const seen = new Set(current.map((item) => item.id));
  const merged = [...current];

  for (const item of incoming) {
    if (seen.has(item.id)) {
      continue;
    }

    seen.add(item.id);
    merged.push(item);
  }

  return merged;
}

function SearchResultSkeleton() {
  return (
    <div
      className="search-result-card search-result-card--skeleton"
      aria-hidden="true"
    >
      <div className="search-result-card-media skeleton-block" />
      <div className="skeleton-line skeleton-line--title" />
      <div className="skeleton-line skeleton-line--short" />
      <div className="skeleton-line skeleton-line--short" />
    </div>
  );
}

function buildInitialFilters(
  props: CatalogBrowseViewProps
): SearchFilters {
  return {
    ...emptySearchFilters,
    gender: props.presetGender ?? "",
    category: props.presetCategory ?? "",
  };
}

export function CatalogBrowseView(props: CatalogBrowseViewProps) {
  const {
    title,
    subtitle,
    searchQuery,
    lockGender = false,
    lockCategory = false,
    defaultSort = "recommended",
    emptyMessage,
    invalidPage = false,
  } = props;

  const [products, setProducts] = useState<
    import("@/lib/recommendationApi").ApiProduct[]
  >([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(!invalidPage);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>(() =>
    buildInitialFilters(props)
  );
  const [sort, setSort] = useState<SortOption>(defaultSort);
  const [filterOptions, setFilterOptions] =
    useState<CatalogFilterOptions>({
      categories: [],
      genders: [],
      sizes: [],
      colors: [],
    });

  useEffect(() => {
    setFilters(buildInitialFilters(props));
    setSort(defaultSort);
  }, [
    props.presetCategory,
    props.presetGender,
    defaultSort,
    invalidPage,
  ]);

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
      if (invalidPage) {
        setProducts([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const mergedFilters: SearchFilters = {
        ...activeFilters,
        gender: lockGender
          ? props.presetGender ?? activeFilters.gender
          : activeFilters.gender,
        category: lockCategory
          ? props.presetCategory ?? activeFilters.category
          : activeFilters.category,
      };

      const listParams = listParamsFromFilters(
        mergedFilters,
        activeSort,
        {
          limit: PAGE_SIZE,
          offset: requestOffset,
        }
      );

      try {
        const response = searchQuery?.trim()
          ? await searchProductsWithMeta(
              searchQuery,
              listParams
            )
          : await getCatalogWithMeta(listParams);

        setTotalCount(response.count);
        setProducts((current) =>
          append
            ? appendUniqueProducts(
                current,
                response.results
              )
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
            : "Unable to load products"
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [
      invalidPage,
      lockCategory,
      lockGender,
      props.presetCategory,
      props.presetGender,
      searchQuery,
    ]
  );

  useEffect(() => {
    void loadPage(0, false, filters, sort);
  }, [filters, loadPage, sort]);

  const loadedCount = products.length;
  const canLoadMore =
    !loading &&
    !loadingMore &&
    !error &&
    !invalidPage &&
    loadedCount > 0 &&
    loadedCount < totalCount;

  function updateFilter<K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) {
    if (key === "gender" && lockGender) {
      return;
    }

    if (key === "category" && lockCategory) {
      return;
    }

    setFilters((current) => ({ ...current, [key]: value }));
  }

  function clearFilters() {
    setFilters(buildInitialFilters(props));
  }

  return (
    <main
      id="main"
      className="search-page search-page--with-announcement"
    >
      <div className="search-page-inner">
        <header className="search-page-header">
          <h1 className="search-page-title">
            {loading && loadedCount === 0 && !invalidPage
              ? "Loading…"
              : title}
          </h1>
          {subtitle ? (
            <p className="search-page-subtitle">{subtitle}</p>
          ) : null}
          {!loading &&
          loadedCount > 0 &&
          loadedCount < totalCount ? (
            <p className="search-page-subtitle">
              Showing {loadedCount.toLocaleString()} of{" "}
              {totalCount.toLocaleString()}
            </p>
          ) : null}
        </header>

        {!invalidPage ? (
          <div className="search-toolbar">
            <div
              className="search-filters"
              aria-label="Product filters"
            >
              {!lockCategory ? (
                <label className="search-filter">
                  <span className="visually-hidden">
                    Category
                  </span>
                  <select
                    value={filters.category}
                    onChange={(event) =>
                      updateFilter(
                        "category",
                        event.target.value
                      )
                    }
                  >
                    <option value="">Category</option>
                    {filterOptions.categories.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      )
                    )}
                  </select>
                </label>
              ) : null}

              {!lockGender ? (
                <label className="search-filter">
                  <span className="visually-hidden">
                    Gender
                  </span>
                  <select
                    value={filters.gender}
                    onChange={(event) =>
                      updateFilter(
                        "gender",
                        event.target.value
                      )
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
              ) : null}

              <label className="search-filter">
                <span className="visually-hidden">Size</span>
                <select
                  value={filters.size}
                  onChange={(event) =>
                    updateFilter("size", event.target.value)
                  }
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
                  onChange={(event) =>
                    updateFilter("color", event.target.value)
                  }
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
                  onChange={(event) =>
                    updateFilter("price", event.target.value)
                  }
                >
                  <option value="">Price</option>
                  <option value="under-1000">
                    Under ₹1,000
                  </option>
                  <option value="1000-3000">
                    ₹1,000 – ₹3,000
                  </option>
                  <option value="over-3000">
                    Over ₹3,000
                  </option>
                </select>
              </label>

              <label className="search-filter">
                <span className="visually-hidden">Stock</span>
                <select
                  value={filters.stock}
                  onChange={(event) =>
                    updateFilter("stock", event.target.value)
                  }
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
              <span className="search-sort-label">
                Sort by
              </span>
              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value as SortOption)
                }
              >
                <option value="recommended">
                  Recommended
                </option>
                <option value="price-asc">
                  Price: low to high
                </option>
                <option value="price-desc">
                  Price: high to low
                </option>
                <option value="newest">Newest</option>
                <option value="rating">Highest rated</option>
              </select>
            </label>
          </div>
        ) : null}

        {error ? (
          <div
            className="search-state search-state--error"
            role="alert"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={() =>
                void loadPage(0, false, filters, sort)
              }
            >
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

        {!error &&
        !loading &&
        (invalidPage || loadedCount === 0) ? (
          <div className="search-state search-state--empty">
            <p>
              {invalidPage
                ? "This category is not available."
                : emptyMessage ??
                  "No products match your filters."}
            </p>
            {!invalidPage ? (
              <button
                type="button"
                className="search-reset-link"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            ) : null}
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

            {canLoadMore ? (
              <div className="search-load-more-wrap">
                <button
                  type="button"
                  className="search-load-more"
                  disabled={loadingMore}
                  onClick={() =>
                    void loadPage(
                      loadedCount,
                      true,
                      filters,
                      sort
                    )
                  }
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

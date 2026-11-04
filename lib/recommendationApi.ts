import {
  getFallbackCatalog,
  getFallbackFilterOptions,
  getFallbackProduct,
  isApiConnectionError,
  searchFallbackCatalog,
} from "@/lib/fallbackCatalog";
import type { SortOption } from "@/lib/searchUtils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_RECOMMENDER_API_URL ??
  "http://127.0.0.1:8000";

export type ApiProduct = {
  id: string;
  name: string;
  category: string;
  gender: string;
  colors: string[];
  style: string[];
  material?: string[];
  season?: string[];
  price: number;
  rating?: number;
  popularity?: number;
  sizes?: string[];
  stock: number;
  imageUrl?: string;
  search_score?: number;
  similarity_score?: number;
  match_type?: "exact" | "related" | string;
};

export type CatalogFilterOptions = {
  categories: string[];
  genders: string[];
  sizes: string[];
  colors: string[];
};

export type ProductListParams = {
  limit?: number;
  offset?: number;
  gender?: string | null;
  includeUnisex?: boolean;
  category?: string | null;
  size?: string | null;
  color?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  stock?: string | null;
  sort?: SortOption;
};

type ProductsResponse = {
  total: number;
  offset: number;
  limit: number;
  count: number;
  products: ApiProduct[];
};

type SearchResponse = {
  query: string;
  count: number;
  offset: number;
  limit: number;
  results: ApiProduct[];
};

type RecommendationResponse = {
  product_id: string;
  count: number;
  results: ApiProduct[];
};

function priceFilterToRange(priceFilter: string): {
  priceMin?: number;
  priceMax?: number;
} {
  switch (priceFilter) {
    case "under-1000":
      return { priceMax: 999.99 };
    case "1000-3000":
      return { priceMin: 1000, priceMax: 3000 };
    case "over-3000":
      return { priceMin: 3000.01 };
    default:
      return {};
  }
}

function buildListQueryParams(
  options: ProductListParams
): URLSearchParams {
  const params = new URLSearchParams({
    limit: String(options.limit ?? 24),
    offset: String(options.offset ?? 0),
  });

  if (options.gender) {
    params.set("gender", options.gender);
  }

  params.set(
    "include_unisex",
    String(options.includeUnisex ?? true)
  );

  if (options.category) {
    params.set("category", options.category);
  }

  if (options.size) {
    params.set("size", options.size);
  }

  if (options.color) {
    params.set("color", options.color);
  }

  if (options.priceMin != null) {
    params.set("price_min", String(options.priceMin));
  }

  if (options.priceMax != null) {
    params.set("price_max", String(options.priceMax));
  }

  if (options.stock) {
    params.set("stock", options.stock);
  }

  if (options.sort) {
    params.set("sort", options.sort);
  }

  return params;
}

function buildSearchBody(
  query: string,
  options: ProductListParams
): Record<string, unknown> {
  const body: Record<string, unknown> = {
    query,
    limit: options.limit ?? 24,
    offset: options.offset ?? 0,
    include_unisex: options.includeUnisex ?? true,
    sort: options.sort ?? "recommended",
  };

  if (options.gender) {
    body.gender = options.gender;
  }

  if (options.category) {
    body.category = options.category;
  }

  if (options.size) {
    body.size = options.size;
  }

  if (options.color) {
    body.color = options.color;
  }

  if (options.priceMin != null) {
    body.price_min = options.priceMin;
  }

  if (options.priceMax != null) {
    body.price_max = options.priceMax;
  }

  if (options.stock) {
    body.stock = options.stock;
  }

  return body;
}

export function listParamsFromFilters(
  filters: {
    category: string;
    gender: string;
    size: string;
    color: string;
    price: string;
    stock: string;
  },
  sort: SortOption,
  paging: { limit?: number; offset?: number } = {}
): ProductListParams {
  const { priceMin, priceMax } = priceFilterToRange(filters.price);

  return {
    limit: paging.limit,
    offset: paging.offset,
    gender: filters.gender || null,
    category: filters.category || null,
    size: filters.size || null,
    color: filters.color || null,
    priceMin: priceMin ?? null,
    priceMax: priceMax ?? null,
    stock: filters.stock || null,
    sort,
  };
}

async function requestJson<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `API request failed (${response.status}): ${errorText}`
    );
  }

  return response.json() as Promise<T>;
}

export async function getCatalogFilterOptions(): Promise<CatalogFilterOptions> {
  try {
    return await requestJson<CatalogFilterOptions>(
      "/products/filter-options"
    );
  } catch (error) {
    if (isApiConnectionError(error)) {
      return getFallbackFilterOptions();
    }

    throw error;
  }
}

export async function getCatalogWithMeta(
  options: ProductListParams = {}
): Promise<{
  count: number;
  total: number;
  offset: number;
  limit: number;
  results: ApiProduct[];
}> {
  try {
    const params = buildListQueryParams(options);
    const response = await requestJson<ProductsResponse>(
      `/products?${params.toString()}`
    );

    return {
      count: response.count,
      total: response.total,
      offset: response.offset,
      limit: response.limit,
      results: response.products,
    };
  } catch (error) {
    if (isApiConnectionError(error)) {
      const limit = options.limit ?? 24;
      const offset = options.offset ?? 0;
      const results = getFallbackCatalog(limit, offset);

      return {
        count: results.length,
        total: results.length,
        offset,
        limit,
        results,
      };
    }

    throw error;
  }
}

export async function getCatalog(
  limit = 16,
  offset = 0
): Promise<ApiProduct[]> {
  const response = await getCatalogWithMeta({ limit, offset });
  return response.results;
}

export async function searchProductsWithMeta(
  query: string,
  options: ProductListParams = {}
): Promise<SearchResponse> {
  try {
    return await requestJson<SearchResponse>("/search", {
      method: "POST",
      body: JSON.stringify(buildSearchBody(query, options)),
    });
  } catch (error) {
    if (isApiConnectionError(error)) {
      return searchFallbackCatalog(query, options);
    }

    throw error;
  }
}

export async function searchProducts(
  query: string,
  options: ProductListParams = {}
): Promise<ApiProduct[]> {
  const response = await searchProductsWithMeta(query, options);
  return response.results;
}

export async function getRecommendations(
  productId: string,
  options: {
    limit?: number;
    gender?: string | null;
    category?: string | null;
    includeUnisex?: boolean;
  } = {}
): Promise<ApiProduct[]> {
  try {
    const response = await requestJson<RecommendationResponse>(
      "/recommend",
      {
        method: "POST",
        body: JSON.stringify({
          product_id: productId,
          n: options.limit ?? 5,
          gender: options.gender ?? null,
          category: options.category ?? null,
          include_unisex: options.includeUnisex ?? true,
        }),
      }
    );

    return response.results;
  } catch (error) {
    if (isApiConnectionError(error)) {
      return [];
    }

    throw error;
  }
}

export async function getProduct(
  productId: string
): Promise<ApiProduct> {
  try {
    return await requestJson<ApiProduct>(
      `/products/${encodeURIComponent(productId)}`
    );
  } catch (error) {
    const fallback = getFallbackProduct(productId);

    if (fallback) {
      return fallback;
    }

    throw error;
  }
}

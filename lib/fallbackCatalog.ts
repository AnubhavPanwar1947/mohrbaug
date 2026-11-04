import { bestsellers, newArrivals } from "@/lib/catalog";
import type { ApiProduct, ProductListParams } from "@/lib/recommendationApi";
import type { SortOption } from "@/lib/searchUtils";

function parseUsdPrice(price: string): number {
  return Number(price.replace(/[^0-9.]/g, "")) || 0;
}

function inferCategory(name: string): string {
  const lower = name.toLowerCase();

  if (lower.includes("dress")) return "Dresses";
  if (lower.includes("denim") || lower.includes("trouser") || lower.includes("skirt")) {
    return "Bottoms";
  }
  if (lower.includes("coat") || lower.includes("jacket") || lower.includes("blazer")) {
    return "Outerwear";
  }
  if (lower.includes("knit") || lower.includes("sweater") || lower.includes("cardigan")) {
    return "Knitwear";
  }
  if (lower.includes("shirt") || lower.includes("tee")) return "Tops";

  return "Tops";
}

function inferGender(name: string): string {
  const lower = name.toLowerCase();

  if (lower.includes("dress") || lower.includes("skirt")) return "women";

  return "unisex";
}

function toApiProduct(
  item: (typeof newArrivals)[number],
  index: number
): ApiProduct {
  const imageUrl = item.image;

  return {
    id: `fallback-${index + 1}`,
    name: item.name,
    category: inferCategory(item.name),
    gender: inferGender(item.name),
    colors: [],
    style: [],
    price: parseUsdPrice(item.price),
    popularity: Math.max(1, 16 - index),
    rating: 4.2,
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 12,
    imageUrl,
  };
}

const fallbackProducts: ApiProduct[] = [...newArrivals, ...bestsellers]
  .filter(
    (product, index, list) =>
      list.findIndex((entry) => entry.name === product.name) === index
  )
  .map(toApiProduct);

export function getFallbackCatalog(
  limit = 16,
  offset = 0
): ApiProduct[] {
  return fallbackProducts.slice(offset, offset + limit);
}

export function getFallbackProduct(
  productId: string
): ApiProduct | null {
  return (
    fallbackProducts.find((product) => product.id === productId) ??
    null
  );
}

export function getFallbackFilterOptions() {
  const categories = new Set<string>();
  const genders = new Set<string>();
  const sizes = new Set<string>();
  const colors = new Set<string>();

  for (const product of fallbackProducts) {
    categories.add(product.category);
    genders.add(product.gender);

    for (const size of product.sizes ?? []) {
      sizes.add(size);
    }

    for (const color of product.colors ?? []) {
      colors.add(color);
    }
  }

  return {
    categories: [...categories].sort(),
    genders: [...genders].sort(),
    sizes: [...sizes].sort(),
    colors: [...colors].sort(),
  };
}

function applyFallbackFilters(
  products: ApiProduct[],
  options: ProductListParams
): ApiProduct[] {
  return products.filter((product) => {
    if (options.category && product.category !== options.category) {
      return false;
    }

    if (options.gender && product.gender !== options.gender) {
      return false;
    }

    if (
      options.size &&
      !(product.sizes ?? []).some(
        (size) =>
          size.toLowerCase() === options.size?.toLowerCase()
      )
    ) {
      return false;
    }

    if (
      options.color &&
      !(product.colors ?? []).some(
        (color) =>
          color.toLowerCase() === options.color?.toLowerCase()
      )
    ) {
      return false;
    }

    if (
      options.priceMin != null &&
      product.price < options.priceMin
    ) {
      return false;
    }

    if (
      options.priceMax != null &&
      product.price > options.priceMax
    ) {
      return false;
    }

    if (options.stock) {
      const stock = product.stock;
      const tone =
        stock <= 0 ? "out" : stock <= 5 ? "low" : "in";

      if (tone !== options.stock) {
        return false;
      }
    }

    return true;
  });
}

function sortFallbackProducts(
  products: ApiProduct[],
  sort: SortOption = "recommended"
): ApiProduct[] {
  const copy = [...products];

  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "rating":
      return copy.sort(
        (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
      );
    case "newest":
      return copy.sort((a, b) => b.id.localeCompare(a.id));
    case "recommended":
    default:
      return copy.sort(
        (a, b) =>
          (b.popularity ?? 0) - (a.popularity ?? 0)
      );
  }
}

export function searchFallbackCatalog(
  query: string,
  options: ProductListParams = {}
): {
  query: string;
  count: number;
  offset: number;
  limit: number;
  results: ApiProduct[];
} {
  const normalized = query.trim().toLowerCase();
  const limit = options.limit ?? 24;
  const offset = options.offset ?? 0;
  const sort = options.sort ?? "recommended";

  if (!normalized) {
    const filtered = sortFallbackProducts(
      applyFallbackFilters(fallbackProducts, options),
      sort
    );

    return {
      query,
      count: filtered.length,
      offset,
      limit,
      results: filtered.slice(offset, offset + limit),
    };
  }

  const tokens = normalized.split(/\s+/).filter(Boolean);

  const matches = fallbackProducts.filter((product) => {
    const haystack = [
      product.name,
      product.category,
      product.gender,
      ...(product.colors ?? []),
      ...(product.style ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return tokens.every((token) => haystack.includes(token));
  });

  const filtered = sortFallbackProducts(
    applyFallbackFilters(matches, options),
    sort
  );

  return {
    query,
    count: filtered.length,
    offset,
    limit,
    results: filtered.slice(offset, offset + limit),
  };
}

export function isApiConnectionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const message = error.message.toLowerCase();
  const cause = error.cause;

  if (message.includes("fetch failed")) return true;
  if (message.includes("econnrefused")) return true;
  if (message.includes("failed to fetch")) return true;

  if (
    cause instanceof Error &&
    (cause.message.includes("ECONNREFUSED") ||
      cause.message.includes("fetch failed"))
  ) {
    return true;
  }

  return false;
}

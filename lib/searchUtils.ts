import type { ApiProduct } from "@/lib/recommendationApi";

export type SortOption =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "rating";

export type SearchFilters = {
  category: string;
  gender: string;
  size: string;
  color: string;
  price: string;
  stock: string;
};

export const emptySearchFilters: SearchFilters = {
  category: "",
  gender: "",
  size: "",
  color: "",
  price: "",
  stock: "",
};

export function stockStatus(stock: number): {
  label: "In stock" | "Low stock" | "Out of stock";
  tone: "in" | "low" | "out";
} {
  if (stock <= 0) {
    return { label: "Out of stock", tone: "out" };
  }

  if (stock <= 5) {
    return { label: "Low stock", tone: "low" };
  }

  return { label: "In stock", tone: "in" };
}

function matchesPrice(product: ApiProduct, priceFilter: string): boolean {
  if (!priceFilter) return true;

  const price = product.price;

  switch (priceFilter) {
    case "under-1000":
      return price < 1000;
    case "1000-3000":
      return price >= 1000 && price <= 3000;
    case "over-3000":
      return price > 3000;
    default:
      return true;
  }
}

function matchesStock(product: ApiProduct, stockFilter: string): boolean {
  if (!stockFilter) return true;

  const { tone } = stockStatus(product.stock);

  return tone === stockFilter;
}

export function filterProducts(
  products: ApiProduct[],
  filters: SearchFilters
): ApiProduct[] {
  return products.filter((product) => {
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    if (filters.gender && product.gender !== filters.gender) {
      return false;
    }

    if (
      filters.size &&
      !(product.sizes ?? []).some(
        (size) => size.toLowerCase() === filters.size.toLowerCase()
      )
    ) {
      return false;
    }

    if (
      filters.color &&
      !(product.colors ?? []).some(
        (color) => color.toLowerCase() === filters.color.toLowerCase()
      )
    ) {
      return false;
    }

    if (!matchesPrice(product, filters.price)) {
      return false;
    }

    if (!matchesStock(product, filters.stock)) {
      return false;
    }

    return true;
  });
}

export function sortProducts(
  products: ApiProduct[],
  sort: SortOption
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
      return copy.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
        })
      );
    case "recommended":
    default:
      return copy.sort(
        (a, b) =>
          (b.search_score ?? b.popularity ?? 0) -
          (a.search_score ?? a.popularity ?? 0)
      );
  }
}

export function collectFilterOptions(products: ApiProduct[]) {
  const categories = new Set<string>();
  const genders = new Set<string>();
  const sizes = new Set<string>();
  const colors = new Set<string>();

  for (const product of products) {
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

export function formatSearchHeading(count: number, query: string): string {
  const formattedCount = count.toLocaleString();

  if (!query.trim()) {
    return `${formattedCount} items`;
  }

  return `${formattedCount} items for ‘${query.trim()}’`;
}

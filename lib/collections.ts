import type { SortOption } from "@/lib/searchUtils";

export type CollectionConfig = {
  title: string;
  subtitle: string;
  sort: SortOption;
  searchQuery?: string;
};

export const COLLECTIONS: Record<string, CollectionConfig> = {
  "new-arrivals": {
    title: "New Arrivals",
    subtitle:
      "Fresh styles from the catalog, sorted by newest first.",
    sort: "newest",
  },
  bestsellers: {
    title: "Bestsellers",
    subtitle:
      "Customer favourites ranked by rating and popularity.",
    sort: "rating",
  },
};

export function resolveCollection(
  slug: string
): CollectionConfig | null {
  const normalized = slug.trim().toLowerCase();
  return COLLECTIONS[normalized] ?? null;
}

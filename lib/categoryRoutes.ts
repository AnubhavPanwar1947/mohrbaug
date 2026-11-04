export type CategoryBrowseMode =
  | "catalog"
  | "search";

export type CategoryRouteConfig = {
  title: string;
  subtitle?: string;
  mode: CategoryBrowseMode;
  searchQuery?: string;
  presetGender?: string;
  presetCategory?: string;
  lockGender?: boolean;
  lockCategory?: boolean;
};

const GROUP_SLUGS: Record<
  string,
  Omit<CategoryRouteConfig, "title"> & { title: string }
> = {
  tops: {
    title: "Tops",
    mode: "search",
    searchQuery: "tops",
    subtitle: "Shirts, blouses, polos, and tees.",
  },
  bottoms: {
    title: "Bottoms",
    mode: "search",
    searchQuery: "trousers",
    subtitle: "Jeans, trousers, shorts, and skirts.",
  },
  outerwear: {
    title: "Outerwear",
    mode: "search",
    searchQuery: "outerwear",
  },
  knitwear: {
    title: "Knitwear",
    mode: "search",
    searchQuery: "sweater",
    subtitle: "Sweaters, hoodies, and sweatshirts.",
  },
  denim: {
    title: "Denim",
    mode: "catalog",
    presetCategory: "jeans",
    lockCategory: true,
  },
  dresses: {
    title: "Dresses",
    mode: "catalog",
    presetCategory: "dress",
    lockCategory: true,
  },
};

const CATEGORY_SLUGS: Record<string, CategoryRouteConfig> = {
  men: {
    title: "Men",
    mode: "catalog",
    presetGender: "men",
    lockGender: true,
    subtitle: "Contemporary menswear from the Mohrbaugh catalog.",
  },
  women: {
    title: "Women",
    mode: "catalog",
    presetGender: "women",
    lockGender: true,
    subtitle: "Contemporary womenswear from the Mohrbaugh catalog.",
  },
  shirt: {
    title: "Shirts",
    mode: "catalog",
    presetCategory: "shirt",
    lockCategory: true,
  },
  blouse: {
    title: "Blouses",
    mode: "catalog",
    presetCategory: "blouse",
    lockCategory: true,
  },
  jeans: {
    title: "Jeans",
    mode: "catalog",
    presetCategory: "jeans",
    lockCategory: true,
  },
  "t-shirt": {
    title: "T-Shirts",
    mode: "catalog",
    presetCategory: "t-shirt",
    lockCategory: true,
  },
  jacket: {
    title: "Jackets",
    mode: "catalog",
    presetCategory: "jacket",
    lockCategory: true,
  },
  sneakers: {
    title: "Sneakers",
    mode: "catalog",
    presetCategory: "sneakers",
    lockCategory: true,
  },
  "polo-shirt": {
    title: "Polo Shirts",
    mode: "catalog",
    presetCategory: "polo-shirt",
    lockCategory: true,
  },
  sweater: {
    title: "Sweaters",
    mode: "catalog",
    presetCategory: "sweater",
    lockCategory: true,
  },
  dress: {
    title: "Dresses",
    mode: "catalog",
    presetCategory: "dress",
    lockCategory: true,
  },
};

export function resolveCategoryRoute(
  slug: string
): CategoryRouteConfig | null {
  const normalized = slug.trim().toLowerCase();

  if (normalized in CATEGORY_SLUGS) {
    return CATEGORY_SLUGS[normalized];
  }

  if (normalized in GROUP_SLUGS) {
    const group = GROUP_SLUGS[normalized];

    return {
      title: group.title,
      subtitle: group.subtitle,
      mode: group.mode,
      searchQuery: group.searchQuery,
      presetGender: group.presetGender,
      presetCategory: group.presetCategory,
      lockGender: group.lockGender,
      lockCategory: group.lockCategory,
    };
  }

  if (/^[a-z0-9-]+$/.test(normalized)) {
    return {
      title: normalized
        .split("-")
        .map(
          (part) =>
            part.charAt(0).toUpperCase() + part.slice(1)
        )
        .join(" "),
      mode: "catalog",
      presetCategory: normalized,
      lockCategory: true,
    };
  }

  return null;
}

export type NavCategoryLink = {
  label: string;
  href: string;
};

export const womenCategoryLinks: NavCategoryLink[] = [
  { label: "New", href: "/collections/new-arrivals" },
  { label: "Tops", href: "/category/tops" },
  { label: "Bottoms", href: "/category/bottoms" },
  { label: "Outerwear", href: "/category/outerwear" },
  { label: "Knitwear", href: "/category/knitwear" },
  { label: "Denim", href: "/category/denim" },
  { label: "Dresses", href: "/category/dresses" },
];

export const menCategoryLinks: NavCategoryLink[] = [
  { label: "New", href: "/collections/new-arrivals" },
  { label: "Tops", href: "/category/tops" },
  { label: "Bottoms", href: "/category/bottoms" },
  { label: "Outerwear", href: "/category/outerwear" },
  { label: "Knitwear", href: "/category/knitwear" },
  { label: "Denim", href: "/category/denim" },
];

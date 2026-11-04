import type { ApiProduct } from "@/lib/recommendationApi";

export type CartLineItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  size?: string;
  quantity: number;
};

export type WishlistItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  gender?: string;
};

const CART_KEY = "mohrbaugh-cart-v1";
const WISHLIST_KEY = "mohrbaugh-wishlist-v1";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadCartItems(): CartLineItem[] {
  return readJson<CartLineItem[]>(CART_KEY, []);
}

export function saveCartItems(items: CartLineItem[]) {
  writeJson(CART_KEY, items);
}

export function loadWishlistItems(): WishlistItem[] {
  return readJson<WishlistItem[]>(WISHLIST_KEY, []);
}

export function saveWishlistItems(items: WishlistItem[]) {
  writeJson(WISHLIST_KEY, items);
}

export function productToWishlistItem(
  product: ApiProduct
): WishlistItem {
  return {
    productId: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    category: product.category,
    gender: product.gender,
  };
}

export function cartLineFromProduct(
  product: ApiProduct,
  quantity: number,
  size?: string | null
): CartLineItem {
  return {
    productId: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    size: size ?? undefined,
    quantity,
  };
}

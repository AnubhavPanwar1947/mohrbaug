"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { ApiProduct } from "@/lib/recommendationApi";
import {
  cartLineFromProduct,
  loadCartItems,
  loadWishlistItems,
  productToWishlistItem,
  saveCartItems,
  saveWishlistItems,
  type CartLineItem,
  type WishlistItem,
} from "@/lib/shopStorage";

type ShopContextValue = {
  cartItems: CartLineItem[];
  wishlistItems: WishlistItem[];
  cartCount: number;
  wishlistCount: number;
  addToCart: (
    product: ApiProduct,
    options?: { quantity?: number; size?: string | null }
  ) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateCartQuantity: (
    productId: string,
    quantity: number,
    size?: string
  ) => void;
  clearCart: () => void;
  toggleWishlist: (product: ApiProduct) => boolean;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
};

const ShopContext = createContext<ShopContextValue | null>(
  null
);

function lineKey(productId: string, size?: string) {
  return `${productId}::${size ?? ""}`;
}

export function ShopProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cartItems, setCartItems] = useState<CartLineItem[]>(
    []
  );
  const [wishlistItems, setWishlistItems] = useState<
    WishlistItem[]
  >([]);
  const [storageHydrated, setStorageHydrated] =
    useState(false);

  useEffect(() => {
    setCartItems(loadCartItems());
    setWishlistItems(loadWishlistItems());
    setStorageHydrated(true);
  }, []);

  useEffect(() => {
    if (!storageHydrated) {
      return;
    }

    saveCartItems(cartItems);
  }, [cartItems, storageHydrated]);

  useEffect(() => {
    if (!storageHydrated) {
      return;
    }

    saveWishlistItems(wishlistItems);
  }, [wishlistItems, storageHydrated]);

  const addToCart = useCallback(
    (
      product: ApiProduct,
      options: {
        quantity?: number;
        size?: string | null;
      } = {}
    ) => {
      const quantity = Math.max(
        1,
        options.quantity ?? 1
      );
      const size = options.size ?? undefined;
      const key = lineKey(product.id, size);

      setCartItems((current) => {
        const existing = current.find(
          (item) =>
            lineKey(item.productId, item.size) === key
        );

        if (existing) {
          return current.map((item) =>
            lineKey(item.productId, item.size) === key
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                }
              : item
          );
        }

        return [
          ...current,
          cartLineFromProduct(
            product,
            quantity,
            size
          ),
        ];
      });
    },
    []
  );

  const removeFromCart = useCallback(
    (productId: string, size?: string) => {
      const key = lineKey(productId, size);

      setCartItems((current) =>
        current.filter(
          (item) =>
            lineKey(item.productId, item.size) !==
            key
        )
      );
    },
    []
  );

  const updateCartQuantity = useCallback(
    (
      productId: string,
      quantity: number,
      size?: string
    ) => {
      const key = lineKey(productId, size);
      const nextQuantity = Math.max(0, quantity);

      setCartItems((current) => {
        if (nextQuantity === 0) {
          return current.filter(
            (item) =>
              lineKey(item.productId, item.size) !==
              key
          );
        }

        return current.map((item) =>
          lineKey(item.productId, item.size) === key
            ? { ...item, quantity: nextQuantity }
            : item
        );
      });
    },
    []
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const removeFromWishlist = useCallback(
    (productId: string) => {
      setWishlistItems((current) =>
        current.filter(
          (item) => item.productId !== productId
        )
      );
    },
    []
  );

  const toggleWishlist = useCallback(
    (product: ApiProduct) => {
      let added = false;

      setWishlistItems((current) => {
        const exists = current.some(
          (item) => item.productId === product.id
        );

        if (exists) {
          added = false;
          return current.filter(
            (item) => item.productId !== product.id
          );
        }

        added = true;
        return [
          ...current,
          productToWishlistItem(product),
        ];
      });

      return added;
    },
    []
  );

  const isInWishlist = useCallback(
    (productId: string) =>
      wishlistItems.some(
        (item) => item.productId === productId
      ),
    [wishlistItems]
  );

  const value = useMemo<ShopContextValue>(
    () => ({
      cartItems,
      wishlistItems,
      cartCount: cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      ),
      wishlistCount: wishlistItems.length,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      removeFromWishlist,
      isInWishlist,
    }),
    [
      addToCart,
      cartItems,
      clearCart,
      isInWishlist,
      removeFromCart,
      removeFromWishlist,
      toggleWishlist,
      updateCartQuantity,
      wishlistItems,
    ]
  );

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error(
      "useShop must be used within ShopProvider"
    );
  }

  return context;
}

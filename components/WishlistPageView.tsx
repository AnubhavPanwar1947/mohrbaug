"use client";

import Link from "next/link";

import { ProductImage } from "@/components/ProductImage";
import { useShop } from "@/components/ShopProvider";

export function WishlistPageView() {
  const { wishlistItems, removeFromWishlist } = useShop();

  if (wishlistItems.length === 0) {
    return (
      <main
        id="main"
        className="wishlist-page content-page--with-announcement"
      >
        <div className="content-page-inner">
          <header className="content-page-header">
            <h1>Wishlist</h1>
            <p className="content-page-lede">
              Save products here while you browse. Sign-in is not
              available yet, so favorites stay on this device only.
            </p>
          </header>
          <div className="content-actions">
            <Link href="/shop" className="content-btn">
              Browse catalog
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      id="main"
      className="wishlist-page content-page--with-announcement"
    >
      <div className="content-page-inner">
        <header className="content-page-header">
          <h1>Wishlist</h1>
          <p className="content-page-lede">
            {wishlistItems.length} saved item
            {wishlistItems.length === 1 ? "" : "s"} on this device.
          </p>
        </header>

        <ul className="wishlist-grid" role="list">
          {wishlistItems.map((item) => (
            <li key={item.productId} className="wishlist-item">
              <Link
                href={`/products/${encodeURIComponent(item.productId)}`}
                className="wishlist-item-link"
              >
                <ProductImage
                  src={item.imageUrl}
                  alt={item.name}
                  width={240}
                  height={300}
                  className="wishlist-item-image"
                />
                <span className="wishlist-item-name">
                  {item.name}
                </span>
                <span className="wishlist-item-price">
                  ₹{item.price.toLocaleString("en-IN")}
                </span>
              </Link>
              <button
                type="button"
                className="wishlist-remove-btn"
                onClick={() =>
                  removeFromWishlist(item.productId)
                }
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

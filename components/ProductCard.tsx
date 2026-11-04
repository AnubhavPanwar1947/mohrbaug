"use client";

import Link from "next/link";

import { useShop } from "@/components/ShopProvider";
import { ProductImage } from "@/components/ProductImage";
import type { ApiProduct } from "@/lib/recommendationApi";

type ProductCardProps = {
  product: ApiProduct;
};

export function ProductCard({
  product,
}: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useShop();
  const saved = isInWishlist(product.id);
  const productHref = `/products/${encodeURIComponent(product.id)}`;

  function handleWishlistClick() {
    toggleWishlist(product);
  }

  return (
    <article
      className="product-card"
      data-product-id={product.id}
    >
      <div className="product-card-media">
        <Link
          href={productHref}
          className="product-card-link"
          scroll
          aria-label={`View ${product.name}`}
        >
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={750}
          />
        </Link>

        <button
          type="button"
          className="wishlist-btn"
          aria-label={
            saved
              ? `Remove ${product.name} from favorites`
              : `Add ${product.name} to favorites`
          }
          aria-pressed={saved}
          onClick={handleWishlistClick}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>

      <h3 className="product-name">
        <Link href={productHref} scroll>
          {product.name}
        </Link>
      </h3>

      <p className="product-price">
        ₹{product.price.toLocaleString("en-IN")}
      </p>
    </article>
  );
}

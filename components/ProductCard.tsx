"use client";

import { useState } from "react";
import type { ApiProduct } from "@/lib/recommendationApi";
import { ProductImage } from "@/components/ProductImage";

type ProductCardProps = {
  product: ApiProduct;
};

export function ProductCard({
  product,
}: ProductCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <article
      className="product-card"
      data-product-id={product.id}
    >
      <div className="product-card-media">
      <ProductImage
  src={product.imageUrl}
  alt={product.name}
  width={600}
  height={750}
/>

        <button
          type="button"
          className="wishlist-btn"
          aria-label={`Add ${product.name} to favorites`}
          aria-pressed={saved}
          onClick={() => setSaved((current) => !current)}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>

      <h3 className="product-name">
        {product.name}
      </h3>

      <p className="product-price">
        ₹{product.price.toLocaleString("en-IN")}
      </p>
    </article>
  );
}
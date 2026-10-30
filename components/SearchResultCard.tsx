"use client";

import { useState } from "react";
import type { ApiProduct } from "@/lib/recommendationApi";
import { stockStatus } from "@/lib/searchUtils";

type SearchResultCardProps = {
  product: ApiProduct;
  eagerImage?: boolean;
};

export function SearchResultCard({
  product,
  eagerImage = false,
}: SearchResultCardProps) {
  const [saved, setSaved] = useState(false);
  const stock = stockStatus(product.stock);

  return (
    <article
      className="search-result-card"
      data-product-id={product.id}
    >
      <div className="search-result-card-media">
        <img
          src={product.imageUrl ?? "/logo.svg"}
          alt={product.name}
          width={600}
          height={750}
          loading={eagerImage ? "eager" : "lazy"}
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

      <h3 className="search-result-card-name">{product.name}</h3>
      <p className="search-result-card-category">{product.category}</p>
      <p className="search-result-card-price">
        ₹{product.price.toLocaleString("en-IN")}
      </p>
      <p className={`search-result-card-stock stock--${stock.tone}`}>
        {stock.label}
      </p>
    </article>
  );
}

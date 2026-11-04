"use client";

import Link from "next/link";
import { useState } from "react";

import { ProductImage } from "@/components/ProductImage";
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
  const productHref = `/products/${encodeURIComponent(product.id)}`;

  return (
    <article className="search-result-card" data-product-id={product.id}>
      <div className="search-result-card-media">
        <Link
          href={productHref}
          className="search-result-card-image-link"
          scroll
          aria-label={`View ${product.name}`}
        >
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={750}
            loading={eagerImage ? "eager" : "lazy"}
          />
        </Link>

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

      <Link href={productHref} className="search-result-card-details" scroll>
        <h3 className="search-result-card-name">{product.name}</h3>
        <p className="search-result-card-category">{product.category}</p>
        <p className="search-result-card-price">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
        <p className={`search-result-card-stock stock--${stock.tone}`}>
          {stock.label}
        </p>
      </Link>
    </article>
  );
}
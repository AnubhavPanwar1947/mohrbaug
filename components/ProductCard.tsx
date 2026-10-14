"use client";

import { useState } from "react";
import type { Product } from "@/lib/catalog";

export function ProductCard({ name, price, image, alt }: Product) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="product-card">
      <div className="product-card-media">
        <img src={image} alt={alt} width={600} height={750} loading="lazy" />
        <button
          type="button"
          className="wishlist-btn"
          aria-label={`Add ${name} to favorites`}
          aria-pressed={saved}
          onClick={() => setSaved((current) => !current)}
        >
          {saved ? "\u2665" : "\u2661"}
        </button>
      </div>
      <h3 className="product-name">{name}</h3>
      <p className="product-price">{price}</p>
    </article>
  );
}

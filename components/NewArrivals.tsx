"use client";

import { useRef } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { ApiProduct } from "@/lib/recommendationApi";

type NewArrivalsProps = {
  products: ApiProduct[];
};

export function NewArrivals({
  products,
}: NewArrivalsProps) {
  const scroller = useRef<HTMLDivElement>(null);

  function scrollByDirection(direction: number) {
    const carousel = scroller.current;

    if (!carousel) return;

    const amount = Math.min(
      carousel.clientWidth * 0.85,
      320
    );

    carousel.scrollBy({
      left: direction * amount,
      behavior: "smooth",
    });
  }

  return (
    <section
      className="section new-arrivals"
      aria-labelledby="new-arrivals-heading"
    >
      <div className="section-header">
        <h2 id="new-arrivals-heading">New arrivals</h2>

        <div className="carousel-controls">
          <button
            type="button"
            className="carousel-btn carousel-btn--prev"
            aria-label="Previous products"
            onClick={() => scrollByDirection(-1)}
          >
            <span aria-hidden="true">&#8592;</span>
          </button>

          <button
            type="button"
            className="carousel-btn carousel-btn--next"
            aria-label="Next products"
            onClick={() => scrollByDirection(1)}
          >
            <span aria-hidden="true">&#8594;</span>
          </button>
        </div>
      </div>

      <div
        className="product-carousel"
        id="carousel-new-arrivals"
        tabIndex={0}
        ref={scroller}
      >
        <ul className="product-row">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
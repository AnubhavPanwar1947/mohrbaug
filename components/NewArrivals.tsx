"use client";

import { useRef } from "react";
import { newArrivals } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";

export function NewArrivals() {
  const scroller = useRef<HTMLDivElement>(null);

  function scrollByDirection(direction: number) {
    const carousel = scroller.current;
    if (!carousel) return;
    const amount = Math.min(carousel.clientWidth * 0.85, 320);
    carousel.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  return (
    <section className="section new-arrivals" aria-labelledby="new-arrivals-heading">
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
      <div className="product-carousel" id="carousel-new-arrivals" tabIndex={0} ref={scroller}>
        <ul className="product-row">
          {newArrivals.map((product) => (
            <li key={product.name}>
              <ProductCard {...product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ProductCard } from "@/components/ProductCard";
import type { ApiProduct } from "@/lib/recommendationApi";

type ProductDetailRelatedProps = {
  products: ApiProduct[];
};

export function ProductDetailRelated({
  products,
}: ProductDetailRelatedProps) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [showControls, setShowControls] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const row = scrollerRef.current;

    if (!row) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = row;
    const hasOverflow = scrollWidth > clientWidth + 1;

    setShowControls(hasOverflow);
    setCanScrollPrev(scrollLeft > 1);
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  useEffect(() => {
    const row = scrollerRef.current;

    if (!row) {
      return;
    }

    updateScrollState();

    row.addEventListener("scroll", updateScrollState, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      updateScrollState();
    });

    resizeObserver.observe(row);

    for (const item of row.querySelectorAll("li")) {
      resizeObserver.observe(item);
    }

    return () => {
      row.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [products, updateScrollState]);

  function scrollByDirection(direction: number) {
    const row = scrollerRef.current;

    if (!row) {
      return;
    }

    const firstItem = row.querySelector("li");

    if (!firstItem) {
      return;
    }

    const gapValue = getComputedStyle(row).gap;
    const gap = Number.parseFloat(gapValue) || 0;
    const step = firstItem.getBoundingClientRect().width + gap;

    row.scrollBy({
      left: direction * step,
      behavior: "smooth",
    });
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className="section pdp-related"
      aria-labelledby="recommendations-heading"
    >
      <div className="pdp-related-header">
        <h2 id="recommendations-heading">You may also like</h2>

        {showControls ? (
          <div className="carousel-controls pdp-related-controls">
            <button
              type="button"
              className="carousel-btn carousel-btn--prev"
              aria-label="Previous products"
              disabled={!canScrollPrev}
              onClick={() => scrollByDirection(-1)}
            >
              <span aria-hidden="true">&#8592;</span>
            </button>

            <button
              type="button"
              className="carousel-btn carousel-btn--next"
              aria-label="Next products"
              disabled={!canScrollNext}
              onClick={() => scrollByDirection(1)}
            >
              <span aria-hidden="true">&#8594;</span>
            </button>
          </div>
        ) : null}
      </div>

      <ul className="pdp-related-row" ref={scrollerRef}>
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}

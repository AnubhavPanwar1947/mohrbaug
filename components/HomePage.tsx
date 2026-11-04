import Link from "next/link";

import { shopCategories } from "@/lib/catalog";
import { NewArrivals } from "@/components/NewArrivals";
import { ProductCard } from "@/components/ProductCard";
import type { ApiProduct } from "@/lib/recommendationApi";

type HomePageProps = {
  newArrivals: ApiProduct[];
  bestsellers: ApiProduct[];
};

export function HomePage({
  newArrivals,
  bestsellers,
}: HomePageProps) {
  return (
    <main id="main" className="home-page">
      <section className="hero-split" aria-label="Featured collections">
        <article className="hero-panel hero-panel--women">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80"
            alt="Woman in tailored outerwear"
            width={1200}
            height={1600}
          />

          <div className="hero-panel-content">
            <p className="hero-label">Women</p>
            <Link href="/category/women" className="hero-cta">
              Shop women
            </Link>
          </div>
        </article>

        <article className="hero-panel hero-panel--men">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80"
            alt="Man in structured jacket"
            width={1200}
            height={1600}
          />

          <div className="hero-panel-content">
            <p className="hero-label">Men</p>
            <Link href="/category/men" className="hero-cta">
              Shop men
            </Link>
          </div>
        </article>
      </section>

      <NewArrivals products={newArrivals} />

      <section
        className="section shop-categories"
        aria-labelledby="categories-heading"
      >
        <h2 id="categories-heading">Shop by category</h2>

        <ul className="category-grid">
          {shopCategories.map((category) => (
            <li key={category.label}>
              <Link
                href={category.href}
                className="category-tile"
                aria-label={`Shop ${category.label}`}
              >
                <img
                  src={category.image}
                  alt=""
                  width={800}
                  height={1000}
                  loading="lazy"
                />
                <span className="category-tile-label">
                  {category.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="editorial-banner"
        aria-labelledby="editorial-heading"
      >
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80"
          alt=""
          width={1920}
          height={1080}
          loading="lazy"
        />

        <div className="editorial-banner-content">
          <h2 id="editorial-heading">
            Layered for the in-between season
          </h2>

          <p className="editorial-copy">
            Soft structure, muted tones, pieces that move from morning to
            evening without changing the mood.
          </p>

          <Link
            href="/category/outerwear"
            className="editorial-link"
          >
            Shop the look
          </Link>
        </div>
      </section>

      <section
        className="section bestsellers"
        aria-labelledby="bestsellers-heading"
      >
        <div className="section-header">
          <h2 id="bestsellers-heading">Bestsellers</h2>

          <Link
            href="/collections/bestsellers"
            className="view-all-link"
          >
            View all
          </Link>
        </div>

        <ul className="product-grid">
          {bestsellers.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

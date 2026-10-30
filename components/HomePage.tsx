import { shopCategories } from "@/lib/catalog";
import { NewArrivals } from "@/components/NewArrivals";
import { ProductCard } from "@/components/ProductCard";
import type { ApiProduct } from "@/lib/recommendationApi";

type HomePageProps = {
  products: ApiProduct[];
};

export function HomePage({ products }: HomePageProps) {
  const newArrivals = products.slice(0, 8);

  const bestsellers = [...products]
    .sort(
      (first, second) =>
        (second.popularity ?? 0) - (first.popularity ?? 0)
    )
    .slice(0, 8);

  return (
    <main id="main">
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
            <a href="#" className="hero-cta">
              Shop women
            </a>
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
            <a href="#" className="hero-cta">
              Shop men
            </a>
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
              <a href="#" className="category-tile">
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
              </a>
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

          <a href="#" className="editorial-link">
            Shop the look
          </a>
        </div>
      </section>

      <section
        className="section bestsellers"
        aria-labelledby="bestsellers-heading"
      >
        <div className="section-header">
          <h2 id="bestsellers-heading">Bestsellers</h2>

          <a href="#" className="view-all-link">
            View all
          </a>
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
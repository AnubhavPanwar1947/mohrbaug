import Link from "next/link";
import { notFound } from "next/navigation";

import { AnnouncementBar } from "@/components/AnnouncementBar";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailBuyPanel } from "@/components/ProductDetailBuyPanel";
import { ProductImage } from "@/components/ProductImage";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  getProduct,
  getRecommendations,
  type ApiProduct,
} from "@/lib/recommendationApi";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function titleCaseGender(gender: string) {
  if (!gender) {
    return gender;
  }

  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

function styleHighlightText(product: ApiProduct) {
  if (!product.style?.length) {
    return null;
  }

  return product.style.slice(0, 3).join(" · ");
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  let product: ApiProduct;

  try {
    product = await getProduct(id);
  } catch {
    notFound();
  }

  let recommendations: ApiProduct[] = [];

  try {
    recommendations = await getRecommendations(
      product.id,
      {
        limit: 8,
        gender: product.gender,
        category: product.category,
        includeUnisex: true,
      }
    );
  } catch {
    recommendations = [];
  }

  const highlight = styleHighlightText(product);
  const extraImages: string[] = [];

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <AnnouncementBar />
      <SiteHeader withAnnouncement solid />

      <main
        id="main"
        className="pdp-page pdp-page--with-announcement"
      >
        <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>{titleCaseGender(product.gender)}</li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <section className="pdp-layout" aria-label="Product">
          <div className="pdp-gallery">
            <div className="pdp-gallery-hero">
              <ProductImage
                src={product.imageUrl}
                alt={product.name}
                width={900}
                height={1125}
                loading="eager"
                className="pdp-hero-image"
              />
              {highlight && (
                <div className="pdp-style-highlights">
                  <p className="pdp-style-highlights-label">
                    Style highlights
                  </p>
                  <p>{highlight}</p>
                </div>
              )}
            </div>

            {extraImages.length > 0 && (
              <ul className="pdp-gallery-mosaic" role="list">
                {extraImages.map((imageUrl, index) => (
                  <li key={`${imageUrl}-${index}`}>
                    <ProductImage
                      src={imageUrl}
                      alt=""
                      width={600}
                      height={750}
                      loading="lazy"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <ProductDetailBuyPanel product={product} />
        </section>

        {recommendations.length > 0 && (
          <section
            className="section pdp-related"
            aria-labelledby="recommendations-heading"
          >
            <h2 id="recommendations-heading">
              You may also like
            </h2>

            <ul className="product-grid pdp-related-grid">
              {recommendations.map((recommendation) => (
                <li key={recommendation.id}>
                  <ProductCard product={recommendation} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <SiteFooter />
    </>
  );
}

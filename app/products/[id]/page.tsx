import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductDetailBuyPanel } from "@/components/ProductDetailBuyPanel";
import { ProductDetailRelated } from "@/components/ProductDetailRelated";
import { ProductImage } from "@/components/ProductImage";
import { SiteChrome } from "@/components/SiteChrome";
import { SiteFooter } from "@/components/SiteFooter";
import { buildProductGalleryImages } from "@/lib/productGallery";
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
  const galleryImages = buildProductGalleryImages(product);
  const relatedProducts = recommendations.slice(0, 8);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <SiteChrome />

      <main
        id="main"
        className="pdp-page"
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
            <ul className="pdp-gallery-stack" role="list">
              {galleryImages.map((imageUrl, index) => (
                <li
                  key={`${imageUrl}-${index}`}
                  className={
                    index === 0
                      ? "pdp-gallery-item pdp-gallery-item--hero"
                      : "pdp-gallery-item"
                  }
                >
                  <ProductImage
                    src={imageUrl}
                    alt={
                      index === 0
                        ? product.name
                        : `${product.name} photo ${index + 1}`
                    }
                    width={900}
                    height={1125}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="pdp-gallery-image"
                  />

                  {index === 0 && highlight && (
                    <div className="pdp-style-highlights">
                      <p className="pdp-style-highlights-label">
                        Style highlights
                      </p>
                      <p>{highlight}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <ProductDetailBuyPanel product={product} />
        </section>

        <ProductDetailRelated products={relatedProducts} />
      </main>

      <SiteFooter />
    </>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductImage } from "@/components/ProductImage";


import { ProductCard } from "@/components/ProductCard";
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
        limit: 5,
        gender: product.gender,
        category: product.category,
        includeUnisex: true,
      }
    );
  } catch {
    recommendations = [];
  }

  return (
    <main className="product-detail-page">
      <Link href="/">← Back to shop</Link>

      <section className="product-detail">
        <div className="product-detail-image">
        <ProductImage
  src={product.imageUrl}
  alt={product.name}
  width={800}
  height={1000}
  loading="eager"
/>
        </div>

        <div className="product-detail-info">
          <p>{product.category}</p>

          <h1>{product.name}</h1>

          <p className="product-detail-price">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          <p>Available stock: {product.stock}</p>
          <p>Gender: {product.gender}</p>
          <p>Colors: {product.colors.join(", ")}</p>
        </div>
      </section>

      {recommendations.length > 0 && (
        <section
          className="section"
          aria-labelledby="recommendations-heading"
        >
          <h2 id="recommendations-heading">
            You may also like
          </h2>

          <ul className="product-grid">
            {recommendations.map((recommendation) => (
              <li key={recommendation.id}>
                <ProductCard product={recommendation} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
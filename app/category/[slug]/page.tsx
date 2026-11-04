import type { Metadata } from "next";
import { Suspense } from "react";

import { CatalogBrowseView } from "@/components/CatalogBrowseView";
import { StorePageShell } from "@/components/StorePageShell";
import { getCatalogFilterOptions } from "@/lib/recommendationApi";
import { resolveCategoryRoute } from "@/lib/categoryRoutes";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = resolveCategoryRoute(slug);

  return {
    title: route
      ? `${route.title} — Mohrbaugh`
      : "Category — Mohrbaugh",
  };
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;
  const route = resolveCategoryRoute(slug);

  let invalidPage = false;

  if (route?.mode === "catalog" && route.presetCategory) {
    try {
      const options = await getCatalogFilterOptions();
      invalidPage = !options.categories.includes(
        route.presetCategory
      );
    } catch {
      invalidPage = false;
    }
  }

  return (
    <StorePageShell>
      <Suspense
        fallback={
          <div className="search-page-loading search-page--with-announcement">
            Loading…
          </div>
        }
      >
        <CatalogBrowseView
          title={route?.title ?? "Category"}
          subtitle={route?.subtitle}
          searchQuery={
            route?.mode === "search"
              ? route.searchQuery
              : undefined
          }
          presetGender={route?.presetGender}
          presetCategory={route?.presetCategory}
          lockGender={route?.lockGender}
          lockCategory={route?.lockCategory}
          invalidPage={!route || invalidPage}
          emptyMessage="No products found in this category."
        />
      </Suspense>
    </StorePageShell>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";

import { CatalogBrowseView } from "@/components/CatalogBrowseView";
import { StorePageShell } from "@/components/StorePageShell";
import { resolveCollection } from "@/lib/collections";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = resolveCollection(slug);

  return {
    title: collection
      ? `${collection.title} — Mohrbaugh`
      : "Collection — Mohrbaugh",
  };
}

export default async function CollectionPage({
  params,
}: CollectionPageProps) {
  const { slug } = await params;
  const collection = resolveCollection(slug);

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
          title={collection?.title ?? "Collection"}
          subtitle={collection?.subtitle}
          defaultSort={collection?.sort ?? "recommended"}
          searchQuery={collection?.searchQuery}
          invalidPage={!collection}
          emptyMessage="This collection is not available."
        />
      </Suspense>
    </StorePageShell>
  );
}

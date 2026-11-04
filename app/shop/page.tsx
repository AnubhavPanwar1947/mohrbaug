import type { Metadata } from "next";
import { Suspense } from "react";

import { CatalogBrowseView } from "@/components/CatalogBrowseView";
import { StorePageShell } from "@/components/StorePageShell";

export const metadata: Metadata = {
  title: "Shop — Mohrbaugh",
  description: "Browse the full Mohrbaugh catalog.",
};

export default function ShopPage() {
  return (
    <StorePageShell>
      <Suspense
        fallback={
          <div className="search-page-loading search-page--with-announcement">
            Loading catalog…
          </div>
        }
      >
        <CatalogBrowseView
          title="Shop all"
          subtitle="Browse the complete catalog with filters and sorting."
        />
      </Suspense>
    </StorePageShell>
  );
}

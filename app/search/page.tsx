import type { Metadata } from "next";
import { Suspense } from "react";

import { SearchResultsView } from "@/components/SearchResultsView";
import { SiteChrome } from "@/components/SiteChrome";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Search — Mohrbaugh",
  description: "Search Mohrbaugh men and women clothing.",
};

export default function SearchPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <SiteChrome />

      <Suspense
        fallback={
          <div className="search-page-loading search-page--with-announcement">
            Loading…
          </div>
        }
      >
        <SearchResultsView />
      </Suspense>

      <SiteFooter />
    </>
  );
}

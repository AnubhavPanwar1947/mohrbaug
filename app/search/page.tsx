import type { Metadata } from "next";
import { Suspense } from "react";

import { AnnouncementBar } from "@/components/AnnouncementBar";
import { SearchResultsView } from "@/components/SearchResultsView";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

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

      <AnnouncementBar />
      <SiteHeader withAnnouncement solid />

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

import { HomePage } from "@/components/HomePage";
import { SiteChrome } from "@/components/SiteChrome";
import { SiteFooter } from "@/components/SiteFooter";
import { getCatalogWithMeta } from "@/lib/recommendationApi";

export default async function Page() {
  const [newArrivalsResponse, bestsellersResponse] =
    await Promise.all([
      getCatalogWithMeta({
        limit: 8,
        offset: 0,
        sort: "newest",
      }),
      getCatalogWithMeta({
        limit: 8,
        offset: 0,
        sort: "rating",
      }),
    ]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <SiteChrome withAnnouncement={false} />
      <HomePage
        newArrivals={newArrivalsResponse.results}
        bestsellers={bestsellersResponse.results}
      />
      <SiteFooter />
    </>
  );
}

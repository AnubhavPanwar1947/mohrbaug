import { HomePage } from "@/components/HomePage";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getCatalog } from "@/lib/recommendationApi";

export default async function Page() {
  const products = await getCatalog(16);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <SiteHeader />
      <HomePage products={products} />
      <SiteFooter />
    </>
  );
}
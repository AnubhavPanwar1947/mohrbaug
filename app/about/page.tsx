import type { Metadata } from "next";

import { ContentPage } from "@/components/ContentPage";
import { StorePageShell } from "@/components/StorePageShell";

export const metadata: Metadata = {
  title: "About — Mohrbaugh",
};

export default function AboutPage() {
  return (
    <StorePageShell>
      <ContentPage
        title="About Mohrbaugh"
        lede="Contemporary clothing for men and women, designed for everyday wear with a clean, modern silhouette."
      >
        <p>
          Mohrbaugh is a demo storefront connected to a content-based
          recommendation API. The catalog, search, and product pages
          load live product data while checkout and account features
          remain in progress.
        </p>
        <p>
          Our focus is thoughtful basics: shirts, denim, knitwear, and
          outerwear with consistent sizing and clear product details.
        </p>
      </ContentPage>
    </StorePageShell>
  );
}

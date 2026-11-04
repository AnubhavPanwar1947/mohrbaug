import type { Metadata } from "next";

import { ContentPage } from "@/components/ContentPage";
import { StorePageShell } from "@/components/StorePageShell";

export const metadata: Metadata = {
  title: "Terms — Mohrbaugh",
};

export default function TermsPage() {
  return (
    <StorePageShell>
      <ContentPage
        title="Terms & conditions"
        lede="Draft placeholder for legal review. Do not treat this as final legal text."
      >
        <p>
          Use of this demo storefront is subject to updated terms
          before public launch. [Legal placeholder — requires review]
        </p>
        <p>
          Product availability, pricing, and promotions may change
          without notice during development.
        </p>
      </ContentPage>
    </StorePageShell>
  );
}

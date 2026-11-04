import type { Metadata } from "next";

import { ContentPage } from "@/components/ContentPage";
import { StorePageShell } from "@/components/StorePageShell";

export const metadata: Metadata = {
  title: "Shipping & returns — Mohrbaugh",
};

export default function ShippingReturnsPage() {
  return (
    <StorePageShell>
      <ContentPage
        title="Shipping & returns"
        lede="Placeholder policy copy for demo purposes. Replace with approved business policy before launch."
      >
        <section className="content-section">
          <h2>Shipping</h2>
          <p>
            Standard delivery timelines and fees will be published here
            once checkout is live. [Business placeholder]
          </p>
        </section>
        <section className="content-section">
          <h2>Exchanges</h2>
          <p>
            Exchange windows and conditions will be confirmed with
            operations. [Business placeholder]
          </p>
        </section>
        <section className="content-section">
          <h2>Returns</h2>
          <p>
            Return eligibility, refund timing, and pickup options will
            be listed here. [Business placeholder]
          </p>
        </section>
      </ContentPage>
    </StorePageShell>
  );
}

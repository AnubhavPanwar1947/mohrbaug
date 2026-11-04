import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/ContentPage";
import { StorePageShell } from "@/components/StorePageShell";

type OrderConfirmationPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: OrderConfirmationPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Order ${id} — Mohrbaugh`,
  };
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { id } = await params;

  return (
    <StorePageShell>
      <ContentPage
        title="Order confirmation preview"
        lede="This screen is a placeholder for a future real checkout flow. No payment was processed and no order was created."
      >
        <p className="content-note">
          Reference ID shown for layout testing only:{" "}
          <strong>{id}</strong>
        </p>
        <p>
          When checkout is connected, this page will show the
          confirmed order summary and delivery details.
        </p>
        <div className="content-actions">
          <Link href="/shop" className="content-btn">
            Continue shopping
          </Link>
          <Link
            href="/shipping-returns"
            className="content-btn content-btn--outline"
          >
            Shipping information
          </Link>
        </div>
      </ContentPage>
    </StorePageShell>
  );
}

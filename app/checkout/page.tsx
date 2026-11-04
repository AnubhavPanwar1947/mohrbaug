import type { Metadata } from "next";

import { CheckoutPageView } from "@/components/CheckoutPageView";
import { StorePageShell } from "@/components/StorePageShell";

export const metadata: Metadata = {
  title: "Checkout — Mohrbaugh",
};

export default function CheckoutPage() {
  return (
    <StorePageShell>
      <CheckoutPageView />
    </StorePageShell>
  );
}

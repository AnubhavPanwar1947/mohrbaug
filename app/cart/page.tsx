import type { Metadata } from "next";

import { CartPageView } from "@/components/CartPageView";
import { StorePageShell } from "@/components/StorePageShell";

export const metadata: Metadata = {
  title: "Shopping bag — Mohrbaugh",
};

export default function CartPage() {
  return (
    <StorePageShell>
      <CartPageView />
    </StorePageShell>
  );
}

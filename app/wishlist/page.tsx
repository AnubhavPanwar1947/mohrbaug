import type { Metadata } from "next";

import { StorePageShell } from "@/components/StorePageShell";
import { WishlistPageView } from "@/components/WishlistPageView";

export const metadata: Metadata = {
  title: "Wishlist — Mohrbaugh",
};

export default function WishlistPage() {
  return (
    <StorePageShell>
      <WishlistPageView />
    </StorePageShell>
  );
}

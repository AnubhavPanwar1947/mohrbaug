import type { Metadata } from "next";

import { ContentPage } from "@/components/ContentPage";
import { StorePageShell } from "@/components/StorePageShell";

export const metadata: Metadata = {
  title: "Privacy — Mohrbaugh",
};

export default function PrivacyPage() {
  return (
    <StorePageShell>
      <ContentPage
        title="Privacy policy"
        lede="Draft placeholder for legal review. Do not treat this as final legal text."
      >
        <p>
          Mohrbaugh may collect contact details, order information,
          and browsing events when those features are enabled.
          [Legal placeholder — requires review]
        </p>
        <p>
          Cart and wishlist data may be stored locally in your browser
          during this demo phase.
        </p>
      </ContentPage>
    </StorePageShell>
  );
}

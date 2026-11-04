import type { Metadata } from "next";

import { ContactPageContent } from "@/components/ContactPageContent";
import { StorePageShell } from "@/components/StorePageShell";

export const metadata: Metadata = {
  title: "Contact — Mohrbaugh",
};

export default function ContactPage() {
  return (
    <StorePageShell>
      <ContactPageContent />
    </StorePageShell>
  );
}

import type { Metadata } from "next";

import { ContentPage } from "@/components/ContentPage";
import { StorePageShell } from "@/components/StorePageShell";

export const metadata: Metadata = {
  title: "FAQ — Mohrbaugh",
};

const faqs = [
  {
    q: "Where does product data come from?",
    a: "The storefront loads products from the Mohrbaugh recommendation API connected to the canonical catalog.",
  },
  {
    q: "How do recommendations work?",
    a: "Product pages call the recommendation API to show similar in-stock items in the You may also like section.",
  },
  {
    q: "Can I place an order today?",
    a: "Checkout is presentational only. Payment and order storage are not connected yet.",
  },
  {
    q: "How do sizes work?",
    a: "Use the size guide and the size selector on each product page. Availability depends on catalog stock.",
  },
  {
    q: "Are search results personalized?",
    a: "Search uses structured filters and content similarity. Click-based personalization is planned for a later phase.",
  },
];

export default function FaqPage() {
  return (
    <StorePageShell>
      <ContentPage title="FAQ" lede="Quick answers about shopping on Mohrbaugh.">
        <dl className="faq-list">
          {faqs.map((item) => (
            <div key={item.q}>
              <dt>{item.q}</dt>
              <dd>{item.a}</dd>
            </div>
          ))}
        </dl>
      </ContentPage>
    </StorePageShell>
  );
}

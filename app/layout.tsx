import type { Metadata } from "next";
import { Suspense } from "react";

import { ScrollToTopOnNavigate } from "@/components/ScrollToTopOnNavigate";
import { ShopProvider } from "@/components/ShopProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mohrbaugh — Men & Women Clothing",
  description: "Mohrbaugh — contemporary men and women clothing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ShopProvider>
          <Suspense fallback={null}>
            <ScrollToTopOnNavigate />
          </Suspense>
          {children}
        </ShopProvider>
      </body>
    </html>
  );
}

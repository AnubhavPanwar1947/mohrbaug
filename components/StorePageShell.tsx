import type { ReactNode } from "react";

import { SiteChrome } from "@/components/SiteChrome";
import { SiteFooter } from "@/components/SiteFooter";

type StorePageShellProps = {
  children: ReactNode;
  withAnnouncement?: boolean;
};

export function StorePageShell({
  children,
  withAnnouncement = true,
}: StorePageShellProps) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <SiteChrome withAnnouncement={withAnnouncement} />

      {children}

      <SiteFooter />
    </>
  );
}

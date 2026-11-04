import { AnnouncementBar } from "@/components/AnnouncementBar";
import { SiteHeader } from "@/components/SiteHeader";

type SiteChromeProps = {
  withAnnouncement?: boolean;
};

export function SiteChrome({
  withAnnouncement = true,
}: SiteChromeProps) {
  return (
    <div
      className={
        withAnnouncement
          ? "site-chrome site-chrome--with-announcement"
          : "site-chrome"
      }
    >
      {withAnnouncement ? <AnnouncementBar /> : null}
      <SiteHeader />
    </div>
  );
}

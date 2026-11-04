import Link from "next/link";

import { NewsletterForm } from "@/components/NewsletterForm";

const shopLinks = [
  { label: "Women", href: "/category/women" },
  { label: "Men", href: "/category/men" },
  { label: "New arrivals", href: "/collections/new-arrivals" },
  { label: "Bestsellers", href: "/collections/bestsellers" },
  { label: "Shop all", href: "/shop" },
];

const helpLinks = [
  { label: "Shipping & returns", href: "/shipping-returns" },
  { label: "Size guide", href: "/size-guide" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const aboutLinks = [
  { label: "Our story", href: "/about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-col">
          <h3>Shop</h3>
          <ul>
            {shopLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="footer-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h3>Help</h3>
          <ul>
            {helpLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="footer-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h3>About</h3>
          <ul>
            {aboutLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="footer-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col footer-newsletter">
          <h3>Newsletter</h3>
          <p>One line a week — new drops and restocks, no noise.</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="footer-bottom">
        <ul className="footer-social" aria-label="Social links">
          <li>
            <span className="footer-social-link footer-social-link--static">
              Instagram
            </span>
          </li>
          <li>
            <span className="footer-social-link footer-social-link--static">
              Pinterest
            </span>
          </li>
          <li>
            <span className="footer-social-link footer-social-link--static">
              TikTok
            </span>
          </li>
        </ul>
        <p className="footer-copy">&copy; Mohrbaugh</p>
      </div>
    </footer>
  );
}

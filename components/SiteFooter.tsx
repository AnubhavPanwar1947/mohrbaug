import { NewsletterForm } from "@/components/NewsletterForm";

const shopLinks = ["Women", "Men", "New arrivals", "Bestsellers"];
const helpLinks = ["Shipping", "Returns", "Size guide", "Contact"];
const aboutLinks = ["Our story", "Sustainability", "Careers", "Stores"];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-col">
          <h3>Shop</h3>
          <ul>
            {shopLinks.map((label) => (
              <li key={label}>
                <a href="#">{label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h3>Help</h3>
          <ul>
            {helpLinks.map((label) => (
              <li key={label}>
                <a href="#">{label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h3>About</h3>
          <ul>
            {aboutLinks.map((label) => (
              <li key={label}>
                <a href="#">{label}</a>
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
            <a href="#">Instagram</a>
          </li>
          <li>
            <a href="#">Pinterest</a>
          </li>
          <li>
            <a href="#">TikTok</a>
          </li>
        </ul>
        <p className="footer-copy">&copy; Mohrbaugh</p>
      </div>
    </footer>
  );
}

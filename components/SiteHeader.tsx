"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import { CartDrawer } from "@/components/CartDrawer";
import { SearchDrawer } from "@/components/SearchDrawer";
import { useShop } from "@/components/ShopProvider";
import {
  menCategoryLinks,
  womenCategoryLinks,
  type NavCategoryLink,
} from "@/lib/categoryRoutes";

type PanelName = "women" | "men";

function CategoryList({ items }: { items: NavCategoryLink[] }) {
  return (
    <ul className="category-list">
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className="category-list-link">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SiteHeader() {
  const { cartCount, wishlistCount } = useShop();
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [activePanel, setActivePanel] =
    useState<PanelName | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const searchToggleRef = useRef<HTMLButtonElement>(null);
  const cartToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow =
      mobileOpen || searchOpen || cartOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, mobileOpen, searchOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      setSearchOpen(false);
      setCartOpen(false);
      setActivePanel(null);
      setMobileOpen(false);
    }

    function onPointerDown(event: MouseEvent) {
      if (window.innerWidth < 1024) return;

      const target = event.target;

      if (!(target instanceof Element)) return;

      if (
        activePanel &&
        !target.closest(".category-panels") &&
        !target.closest(".nav-trigger")
      ) {
        setActivePanel(null);
      }

      if (
        searchOpen &&
        !target.closest(".site-drawer") &&
        !target.closest(".search-toggle")
      ) {
        setSearchOpen(false);
      }

      if (
        cartOpen &&
        !target.closest(".site-drawer") &&
        !target.closest(".cart-toggle")
      ) {
        setCartOpen(false);
      }
    }

    function onResize() {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      } else {
        setActivePanel(null);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onPointerDown);
    window.addEventListener("resize", onResize);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onPointerDown);
      window.removeEventListener("resize", onResize);
    };
  }, [activePanel, cartOpen, searchOpen]);

  function openSearch() {
    setActivePanel(null);
    setMobileOpen(false);
    setCartOpen(false);
    setSearchOpen(true);
  }

  function openCart() {
    setActivePanel(null);
    setMobileOpen(false);
    setSearchOpen(false);
    setCartOpen(true);
  }

  function togglePanel(name: PanelName) {
    if (window.innerWidth < 1024) return;

    setSearchOpen(false);

    setActivePanel((current) =>
      current === name ? null : name
    );
  }

  function toggleMobile() {
    setMobileOpen((open) => {
      if (!open) {
        setSearchOpen(false);
      }

      return !open;
    });
  }

  return (
    <>
      <header className="site-header" id="site-header">
        <div className="header-inner">
          <div className="header-left">
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label="Open menu"
              onClick={toggleMobile}
            >
              <span className="menu-toggle-bar" />
              <span className="menu-toggle-bar" />
              <span className="menu-toggle-bar" />
            </button>

            <nav
              className="nav-desktop"
              aria-label="Primary"
            >
              <div className="nav-item">
                <Link
                  href="/category/women"
                  className="nav-link"
                  onClick={() => setActivePanel(null)}
                >
                  Women
                </Link>
                <button
                  type="button"
                  className="nav-link nav-trigger nav-trigger--caret"
                  aria-expanded={
                    activePanel === "women"
                  }
                  aria-controls="panel-women"
                  aria-label="Show women categories"
                  onClick={() => togglePanel("women")}
                />
              </div>

              <div className="nav-item">
                <Link
                  href="/category/men"
                  className="nav-link"
                  onClick={() => setActivePanel(null)}
                >
                  Men
                </Link>
                <button
                  type="button"
                  className="nav-link nav-trigger nav-trigger--caret"
                  aria-expanded={
                    activePanel === "men"
                  }
                  aria-controls="panel-men"
                  aria-label="Show men categories"
                  onClick={() => togglePanel("men")}
                />
              </div>
            </nav>
          </div>

          <Link
            href="/"
            className="logo"
            aria-label="Mohrbaugh home"
          >
            <picture>
              <source
                media="(max-width: 319px)"
                srcSet="/logo-compact.svg"
              />

              <img
                className="logo-img"
                src="/logo.svg"
                alt=""
                width={1600}
                height={645}
                decoding="async"
              />
            </picture>
          </Link>

          <div className="header-right">
            <div className="header-actions header-actions--compact">
              <button
                ref={searchToggleRef}
                type="button"
                className="icon-btn icon-btn--hide-narrow search-toggle"
                aria-expanded={searchOpen}
                aria-controls="search-drawer"
                aria-haspopup="dialog"
                aria-label="Search"
                onClick={() =>
                  searchOpen
                    ? setSearchOpen(false)
                    : openSearch()
                }
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
              </button>

              <Link
                href="/wishlist"
                className="icon-btn icon-btn--hide-narrow"
                aria-label={`Favorites, ${wishlistCount} saved`}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M12 21s-8-4.5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-8 11-8 11z" />
                </svg>
                {wishlistCount > 0 ? (
                  <span className="bag-count">{wishlistCount}</span>
                ) : null}
              </Link>

              <button
                ref={cartToggleRef}
                type="button"
                className="icon-btn bag-btn cart-toggle"
                aria-expanded={cartOpen}
                aria-controls="cart-drawer"
                aria-haspopup="dialog"
                aria-label={`Shopping bag, ${cartCount} items`}
                onClick={() =>
                  cartOpen ? setCartOpen(false) : openCart()
                }
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M6 7h12l-1 14H7L6 7z" />
                  <path d="M9 7V5a3 3 0 0 1 6 0v2" />
                </svg>

                {cartCount > 0 ? (
                  <span className="bag-count">{cartCount}</span>
                ) : null}
              </button>

              <button
                type="button"
                className="icon-btn icon-btn--hide-narrow"
                aria-label="Account (coming soon)"
                disabled
                title="Sign in coming soon"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div
          className="category-panels"
          id="category-panels"
          hidden={activePanel === null}
        >
          <div
            className="category-panel"
            id="panel-women"
            role="region"
            aria-label="Women categories"
            hidden={activePanel !== "women"}
          >
            <CategoryList items={womenCategoryLinks} />
          </div>

          <div
            className="category-panel"
            id="panel-men"
            role="region"
            aria-label="Men categories"
            hidden={activePanel !== "men"}
          >
            <CategoryList items={menCategoryLinks} />
          </div>
        </div>
      </header>

      <SearchDrawer
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        returnFocusRef={searchToggleRef}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        returnFocusRef={cartToggleRef}
      />

      <div
        className="mobile-nav-overlay"
        id="mobile-nav-overlay"
        hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={`mobile-nav${
          mobileOpen ? " is-open" : ""
        }`}
        id="mobile-nav"
        aria-hidden={!mobileOpen}
        aria-label="Mobile menu"
      >
        <div className="mobile-nav-header">
          <span className="mobile-nav-title">Menu</span>

          <button
            type="button"
            className="mobile-nav-close"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          >
            &times;
          </button>
        </div>

        <nav className="mobile-nav-links">
          <details className="mobile-nav-group">
            <summary>Women</summary>

            <ul>
              {womenCategoryLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="mobile-nav-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>

          <details className="mobile-nav-group">
            <summary>Men</summary>

            <ul>
              {menCategoryLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="mobile-nav-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </nav>

        <div className="mobile-nav-actions">
          <button
            type="button"
            className="mobile-nav-action"
            onClick={openSearch}
          >
            Search
          </button>

          <Link
            href="/wishlist"
            className="mobile-nav-action"
            onClick={() => setMobileOpen(false)}
          >
            Favorites
          </Link>

          <button
            type="button"
            className="mobile-nav-action"
            onClick={() => {
              setMobileOpen(false);
              openCart();
            }}
          >
            Bag ({cartCount})
          </button>

          <button
            type="button"
            className="mobile-nav-action"
            disabled
            title="Sign in coming soon"
          >
            Account (soon)
          </button>
        </div>
      </aside>
    </>
  );
}
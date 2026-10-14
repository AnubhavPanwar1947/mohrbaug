"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { menCategories, searchSuggestions, womenCategories } from "@/lib/catalog";

type PanelName = "women" | "men";

function CategoryList({ items }: { items: string[] }) {
  return (
    <ul className="category-list">
      {items.map((item) => (
        <li key={item}>
          <a href="#">{item}</a>
        </li>
      ))}
    </ul>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelName | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setSearchOpen(false);
      setActivePanel(null);
      setMobileOpen(false);
    }

    function onPointerDown(event: MouseEvent) {
      if (window.innerWidth < 1024) return;
      const target = event.target;
      if (!(target instanceof Element)) return;

      if (activePanel && !target.closest(".category-panels") && !target.closest(".nav-trigger")) {
        setActivePanel(null);
      }

      if (searchOpen && !target.closest(".search-panel") && !target.closest(".search-toggle")) {
        setSearchOpen(false);
      }
    }

    function onResize() {
      if (window.innerWidth >= 1024) setMobileOpen(false);
      else setActivePanel(null);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onPointerDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onPointerDown);
      window.removeEventListener("resize", onResize);
    };
  }, [activePanel, searchOpen]);

  function openSearch() {
    setActivePanel(null);
    setMobileOpen(false);
    setSearchOpen(true);
  }

  function togglePanel(name: PanelName) {
    if (window.innerWidth < 1024) return;
    setSearchOpen(false);
    setActivePanel((current) => (current === name ? null : name));
  }

  function toggleMobile() {
    setMobileOpen((open) => {
      if (!open) setSearchOpen(false);
      return !open;
    });
  }

  return (
    <>
      <header
        className={`site-header${scrolled ? " is-scrolled" : ""}`}
        id="site-header"
      >
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
            <nav className="nav-desktop" aria-label="Primary">
              <div className="nav-item">
                <button
                  type="button"
                  className="nav-link nav-trigger"
                  aria-expanded={activePanel === "women"}
                  aria-controls="panel-women"
                  onClick={() => togglePanel("women")}
                >
                  Women
                </button>
              </div>
              <div className="nav-item">
                <button
                  type="button"
                  className="nav-link nav-trigger"
                  aria-expanded={activePanel === "men"}
                  aria-controls="panel-men"
                  onClick={() => togglePanel("men")}
                >
                  Men
                </button>
              </div>
            </nav>
          </div>

          <Link href="/" className="logo" aria-label="Mohrbaugh home">
            <img
              className="logo-img"
              src="/logo.svg"
              alt=""
              width={1768}
              height={1800}
              decoding="async"
            />
          </Link>

          <div className="header-right">
            <div className="header-actions header-actions--compact">
              <button
                type="button"
                className="icon-btn icon-btn--hide-narrow search-toggle"
                aria-expanded={searchOpen}
                aria-controls="search-panel"
                aria-label="Search"
                onClick={() => (searchOpen ? setSearchOpen(false) : openSearch())}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
              </button>
              <a href="#" className="icon-btn icon-btn--hide-narrow" aria-label="Favorites">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M12 21s-8-4.5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-8 11-8 11z" />
                </svg>
              </a>
              <a href="#" className="icon-btn bag-btn" aria-label="Shopping bag, 2 items">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M6 7h12l-1 14H7L6 7z" />
                  <path d="M9 7V5a3 3 0 0 1 6 0v2" />
                </svg>
                <span className="bag-count">2</span>
              </a>
              <a href="#" className="icon-btn icon-btn--hide-narrow" aria-label="Account">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="category-panels" id="category-panels" hidden={activePanel === null}>
          <div
            className="category-panel"
            id="panel-women"
            role="region"
            aria-label="Women categories"
            hidden={activePanel !== "women"}
          >
            <CategoryList items={womenCategories} />
          </div>
          <div
            className="category-panel"
            id="panel-men"
            role="region"
            aria-label="Men categories"
            hidden={activePanel !== "men"}
          >
            <CategoryList items={menCategories} />
          </div>
        </div>

        <div className="search-panel" id="search-panel" hidden={!searchOpen}>
          <div className="search-panel-inner">
            <label className="search-label" htmlFor="search-input">
              Search Mohrbaugh
            </label>
            <input
              ref={searchInputRef}
              type="search"
              id="search-input"
              className="search-input"
              placeholder="Search clothing, categories…"
              autoComplete="off"
            />
            <p className="search-suggestions-label">Popular searches</p>
            <ul className="search-suggestions">
              {searchSuggestions.map((term) => (
                <li key={term}>
                  <a href="#">{term}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <div
        className="mobile-nav-overlay"
        id="mobile-nav-overlay"
        hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
      />
      <aside className={`mobile-nav${mobileOpen ? " is-open" : ""}`} id="mobile-nav" aria-hidden={!mobileOpen} aria-label="Mobile menu">
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
              {womenCategories.map((item) => (
                <li key={item}>
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </details>
          <details className="mobile-nav-group">
            <summary>Men</summary>
            <ul>
              {menCategories.map((item) => (
                <li key={item}>
                  <a href="#">{item}</a>
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
          <a href="#" className="mobile-nav-action">
            Favorites
          </a>
          <a href="#" className="mobile-nav-action">
            Account
          </a>
        </div>
      </aside>
    </>
  );
}

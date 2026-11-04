"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type FormEvent,
  type RefObject,
  useEffect,
  useState,
} from "react";

import { SiteDrawer } from "@/components/SiteDrawer";
import { ProductImage } from "@/components/ProductImage";
import { searchSuggestions } from "@/lib/catalog";
import {
  getCatalogWithMeta,
  type ApiProduct,
} from "@/lib/recommendationApi";

type SearchDrawerProps = {
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
};

export function SearchDrawer({
  open,
  onClose,
  returnFocusRef,
  searchQuery,
  onSearchQueryChange,
}: SearchDrawerProps) {
  const router = useRouter();
  const [recommended, setRecommended] = useState<ApiProduct[]>([]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    void getCatalogWithMeta({
      limit: 6,
      offset: 0,
      sort: "rating",
    })
      .then((response) => {
        if (!cancelled) {
          setRecommended(response.results);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRecommended([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const input = document.getElementById(
      "search-drawer-input"
    );

    if (input instanceof HTMLInputElement) {
      input.focus();
    }
  }, [open]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    onClose();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  function goToSearch(term: string) {
    onClose();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  return (
    <SiteDrawer
      id="search-drawer"
      open={open}
      onClose={onClose}
      ariaLabel="Search"
      returnFocusRef={returnFocusRef}
      titleVisible
      autoFocusClose={false}
    >
      <form className="search-drawer-form" onSubmit={submitSearch}>
        <label className="visually-hidden" htmlFor="search-drawer-input">
          Search Mohrbaugh
        </label>

        <input
          id="search-drawer-input"
          type="search"
          className="search-drawer-input"
          placeholder="What are you looking for?"
          autoComplete="off"
          value={searchQuery}
          onChange={(event) =>
            onSearchQueryChange(event.target.value)
          }
        />
      </form>

      {!searchQuery.trim() ? (
        <>
          <p className="search-drawer-section-label">
            Popular searches
          </p>

          <ul className="search-drawer-pills" role="list">
            {searchSuggestions.map((term) => (
              <li key={term}>
                <button
                  type="button"
                  className="search-drawer-pill"
                  onClick={() => goToSearch(term)}
                >
                  {term}
                </button>
              </li>
            ))}
          </ul>

          {recommended.length > 0 ? (
            <div className="search-drawer-recs">
              <p className="search-drawer-section-label">
                Best sellers
              </p>

              <ul className="search-drawer-product-grid" role="list">
                {recommended.map((product) => {
                  const href = `/products/${encodeURIComponent(product.id)}`;

                  return (
                    <li key={product.id}>
                      <Link
                        href={href}
                        className="search-drawer-product"
                        onClick={onClose}
                        scroll
                      >
                        <div className="search-drawer-product-media">
                          <ProductImage
                            src={product.imageUrl}
                            alt={product.name}
                            width={300}
                            height={375}
                          />
                        </div>

                        <p className="search-drawer-product-name">
                          {product.name}
                        </p>

                        <p className="search-drawer-product-price">
                          ₹
                          {product.price.toLocaleString("en-IN")}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </>
      ) : (
        <div className="search-drawer-active-query">
          <button
            type="button"
            className="search-drawer-submit-link"
            onClick={() => goToSearch(searchQuery.trim())}
          >
            Search for “{searchQuery.trim()}”
          </button>
        </div>
      )}
    </SiteDrawer>
  );
}

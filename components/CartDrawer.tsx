"use client";

import Link from "next/link";
import { type RefObject } from "react";

import { SiteDrawer } from "@/components/SiteDrawer";
import { ProductImage } from "@/components/ProductImage";
import { useShop } from "@/components/ShopProvider";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
};

export function CartDrawer({
  open,
  onClose,
  returnFocusRef,
}: CartDrawerProps) {
  const {
    cartItems,
    cartCount,
    removeFromCart,
    updateCartQuantity,
  } = useShop();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartHeading = `Your Cart (${cartCount} item${
    cartCount === 1 ? "" : "s"
  })`;

  return (
    <SiteDrawer
      id="cart-drawer"
      open={open}
      onClose={onClose}
      ariaLabel={cartHeading}
      returnFocusRef={returnFocusRef}
      titleVisible
    >
      {cartItems.length === 0 ? (
        <div className="cart-drawer-empty">
          <p className="cart-drawer-promo">
            Free shipping on orders over ₹2,999
          </p>

          <p className="cart-drawer-empty-heading">Nothing here</p>

          <div className="cart-drawer-empty-actions">
            <Link
              href="/shop"
              className="content-btn"
              onClick={onClose}
            >
              Explore products
            </Link>
          </div>
        </div>
      ) : (
        <>
          <ul className="cart-drawer-lines" role="list">
            {cartItems.map((item) => (
              <li
                key={`${item.productId}-${item.size ?? ""}`}
                className="cart-drawer-line"
              >
                <Link
                  href={`/products/${encodeURIComponent(item.productId)}`}
                  className="cart-drawer-line-media"
                  onClick={onClose}
                >
                  <ProductImage
                    src={item.imageUrl}
                    alt={item.name}
                    width={96}
                    height={120}
                    className="cart-drawer-line-image"
                  />
                </Link>

                <div className="cart-drawer-line-details">
                  <Link
                    href={`/products/${encodeURIComponent(item.productId)}`}
                    className="cart-drawer-line-title"
                    onClick={onClose}
                  >
                    {item.name}
                  </Link>

                  {item.size ? (
                    <p className="cart-drawer-line-meta">
                      Size {item.size}
                    </p>
                  ) : null}

                  <p className="cart-drawer-line-price">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>

                  <div className="cart-drawer-line-controls">
                    <label className="cart-qty-label">
                      <span className="visually-hidden">
                        Quantity
                      </span>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(event) =>
                          updateCartQuantity(
                            item.productId,
                            Number(event.target.value),
                            item.size
                          )
                        }
                      />
                    </label>

                    <button
                      type="button"
                      className="cart-remove-btn"
                      onClick={() =>
                        removeFromCart(
                          item.productId,
                          item.size
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-drawer-footer">
            <p className="cart-drawer-subtotal">
              Subtotal{" "}
              <strong>
                ₹{subtotal.toLocaleString("en-IN")}
              </strong>
            </p>

            <p className="content-note">
              Shipping and taxes at checkout.
            </p>

            <Link
              href="/checkout"
              className="content-btn cart-drawer-checkout"
              onClick={onClose}
            >
              Continue to checkout
            </Link>

            <Link
              href="/cart"
              className="cart-drawer-full-link"
              onClick={onClose}
            >
              View full bag
            </Link>

            <button
              type="button"
              className="cart-drawer-continue"
              onClick={onClose}
            >
              Continue shopping
            </button>
          </div>
        </>
      )}
    </SiteDrawer>
  );
}

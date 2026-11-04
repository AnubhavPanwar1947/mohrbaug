"use client";

import Link from "next/link";

import { ProductImage } from "@/components/ProductImage";
import { useShop } from "@/components/ShopProvider";

export function CartPageView() {
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

  if (cartItems.length === 0) {
    return (
      <main
        id="main"
        className="cart-page content-page--with-announcement"
      >
        <div className="content-page-inner">
          <header className="content-page-header">
            <h1>Shopping bag</h1>
            <p className="content-page-lede">
              Your bag is empty. Browse the catalog to add items.
            </p>
          </header>
          <div className="content-actions">
            <Link href="/shop" className="content-btn">
              Shop all
            </Link>
            <Link href="/collections/new-arrivals" className="content-btn content-btn--outline">
              New arrivals
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      id="main"
      className="cart-page content-page--with-announcement"
    >
      <div className="content-page-inner cart-page-inner">
        <header className="content-page-header">
          <h1>Shopping bag</h1>
          <p className="content-page-lede">
            {cartCount} item{cartCount === 1 ? "" : "s"} saved
            locally on this device.
          </p>
        </header>

        <ul className="cart-lines" role="list">
          {cartItems.map((item) => (
            <li
              key={`${item.productId}-${item.size ?? ""}`}
              className="cart-line"
            >
              <Link
                href={`/products/${encodeURIComponent(item.productId)}`}
                className="cart-line-media"
              >
                <ProductImage
                  src={item.imageUrl}
                  alt={item.name}
                  width={120}
                  height={150}
                  className="cart-line-image"
                />
              </Link>

              <div className="cart-line-details">
                <Link
                  href={`/products/${encodeURIComponent(item.productId)}`}
                  className="cart-line-title"
                >
                  {item.name}
                </Link>
                {item.size ? (
                  <p className="cart-line-meta">Size {item.size}</p>
                ) : null}
                <p className="cart-line-price">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>

                <div className="cart-line-controls">
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

              <p className="cart-line-subtotal">
                ₹
                {(
                  item.price * item.quantity
                ).toLocaleString("en-IN")}
              </p>
            </li>
          ))}
        </ul>

        <aside className="cart-summary" aria-label="Order summary">
          <h2>Summary</h2>
          <p>
            Subtotal{" "}
            <strong>
              ₹{subtotal.toLocaleString("en-IN")}
            </strong>
          </p>
          <p className="content-note">
            Shipping and taxes are calculated at checkout.
            No order has been placed yet.
          </p>
          <Link href="/checkout" className="content-btn">
            Continue to checkout
          </Link>
        </aside>
      </div>
    </main>
  );
}

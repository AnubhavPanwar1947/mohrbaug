"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { useShop } from "@/components/ShopProvider";

export function CheckoutPageView() {
  const { cartItems, cartCount } = useShop();
  const [statusMessage, setStatusMessage] = useState<
    string | null
  >(null);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(
      "Checkout is presentational only. Payment and order creation are not connected yet."
    );
  }

  if (cartItems.length === 0) {
    return (
      <main
        id="main"
        className="checkout-page content-page--with-announcement"
      >
        <div className="content-page-inner">
          <header className="content-page-header">
            <h1>Checkout</h1>
            <p className="content-page-lede">
              Add items to your bag before checkout.
            </p>
          </header>
          <Link href="/shop" className="content-btn">
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      id="main"
      className="checkout-page content-page--with-announcement"
    >
      <div className="content-page-inner checkout-page-inner">
        <header className="content-page-header">
          <h1>Checkout</h1>
          <p className="content-page-lede">
            Review your details below. Payment processing is not
            live yet.
          </p>
        </header>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <section className="checkout-section">
            <h2>Contact</h2>
            <label>
              Email
              <input type="email" name="email" required />
            </label>
            <label>
              Phone
              <input type="tel" name="phone" required />
            </label>
          </section>

          <section className="checkout-section">
            <h2>Shipping address</h2>
            <label>
              Full name
              <input type="text" name="name" required />
            </label>
            <label>
              Address line 1
              <input type="text" name="address1" required />
            </label>
            <label>
              City
              <input type="text" name="city" required />
            </label>
            <label>
              Pincode
              <input
                type="text"
                name="pincode"
                inputMode="numeric"
                pattern="\d{6}"
                required
              />
            </label>
          </section>

          <section className="checkout-section">
            <h2>Delivery</h2>
            <label className="checkout-radio">
              <input
                type="radio"
                name="delivery"
                value="standard"
                defaultChecked
              />
              Standard delivery (placeholder)
            </label>
            <label className="checkout-radio">
              <input type="radio" name="delivery" value="express" />
              Express delivery (placeholder)
            </label>
          </section>

          <section className="checkout-section checkout-payment-placeholder">
            <h2>Payment</h2>
            <p className="content-note">
              Payment gateway placeholder. Card, UPI, and wallet
              options will appear here after backend integration.
            </p>
          </section>

          <aside className="checkout-summary" aria-label="Order summary">
            <h2>Order summary</h2>
            <p>
              {cartCount} item{cartCount === 1 ? "" : "s"}
            </p>
            <p>
              Subtotal{" "}
              <strong>
                ₹{subtotal.toLocaleString("en-IN")}
              </strong>
            </p>
            <button type="submit" className="content-btn">
              Place order (unavailable)
            </button>
            {statusMessage ? (
              <p className="content-note" role="status">
                {statusMessage}
              </p>
            ) : null}
          </aside>
        </form>
      </div>
    </main>
  );
}

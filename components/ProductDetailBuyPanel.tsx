"use client";

import { useId, useState } from "react";

import type { ApiProduct } from "@/lib/recommendationApi";

type ProductDetailBuyPanelProps = {
  product: ApiProduct;
};

type AccordionId = "details" | "shipping" | "reviews";

function formatList(values?: string[]) {
  if (!values?.length) {
    return null;
  }

  return values.join(", ");
}

export function ProductDetailBuyPanel({
  product,
}: ProductDetailBuyPanelProps) {
  const pincodeFieldId = useId();
  const [selectedSize, setSelectedSize] = useState<string | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState<
    string | null
  >(null);
  const [actionMessage, setActionMessage] = useState<string | null>(
    null
  );
  const [openAccordion, setOpenAccordion] =
    useState<AccordionId | null>("details");

  const sizes = product.sizes ?? [];
  const requiresSize = sizes.length > 0;
  const colorLabel = product.colors[0];

  const detailRows: { label: string; value: string }[] = [];

  const material = formatList(product.material);
  const style = formatList(product.style);
  const season = formatList(product.season);

  if (material) {
    detailRows.push({ label: "Material", value: material });
  }
  if (style) {
    detailRows.push({ label: "Style", value: style });
  }
  if (season) {
    detailRows.push({ label: "Season", value: season });
  }
  if (product.gender) {
    detailRows.push({
      label: "Gender",
      value: product.gender,
    });
  }
  if (product.colors.length) {
    detailRows.push({
      label: "Colors",
      value: product.colors.join(", "),
    });
  }
  detailRows.push({
    label: "Stock",
    value: String(product.stock),
  });

  function validateSize() {
    if (requiresSize && !selectedSize) {
      setActionMessage("Select a size to continue.");
      return false;
    }

    return true;
  }

  function handleAddToCart() {
    if (!validateSize()) {
      return;
    }

    setActionMessage(
      `Added ${quantity} item${quantity > 1 ? "s" : ""} to cart.`
    );
  }

  function handleBuyNow() {
    if (!validateSize()) {
      return;
    }

    setActionMessage(
      "Buy now is not connected to checkout yet."
    );
  }

  function handlePincodeCheck() {
    const normalized = pincode.trim();

    if (!/^\d{6}$/.test(normalized)) {
      setDeliveryMessage("Enter a valid 6-digit pincode.");
      return;
    }

    setDeliveryMessage(
      "Standard delivery is available for this pincode."
    );
  }

  function toggleAccordion(id: AccordionId) {
    setOpenAccordion((current) =>
      current === id ? null : id
    );
  }

  return (
    <div className="pdp-buy">
      <h1 className="pdp-title">{product.name}</h1>

      <div className="pdp-meta">
        <p className="pdp-price">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
        {product.rating != null && (
          <p className="pdp-rating">
            Rating {product.rating.toFixed(1)}
          </p>
        )}
      </div>

      {colorLabel && (
        <p className="pdp-label">
          Colour{" "}
          <span className="pdp-label-value">{colorLabel}</span>
        </p>
      )}

      {sizes.length > 0 && (
        <div className="pdp-sizes">
          <p className="pdp-label">
            Size{" "}
            {selectedSize && (
              <span className="pdp-label-value">
                {selectedSize}
              </span>
            )}
          </p>
          <ul className="pdp-size-list" role="list">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;

              return (
                <li key={size}>
                  <button
                    type="button"
                    className="pdp-size-btn"
                    aria-pressed={isSelected}
                    onClick={() => {
                      setSelectedSize(size);
                      setActionMessage(null);
                    }}
                  >
                    {size}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="pdp-purchase-row">
        <div className="pdp-qty">
          <span className="pdp-label pdp-label--inline">
            Qty
          </span>
          <button
            type="button"
            className="pdp-qty-btn"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() =>
              setQuantity((current) => Math.max(1, current - 1))
            }
          >
            −
          </button>
          <span className="pdp-qty-value" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            className="pdp-qty-btn"
            aria-label="Increase quantity"
            onClick={() => setQuantity((current) => current + 1)}
          >
            +
          </button>
        </div>

        <button
          type="button"
          className="pdp-btn pdp-btn--primary"
          onClick={handleAddToCart}
        >
          Add to cart
        </button>
      </div>

      <button
        type="button"
        className="pdp-btn pdp-btn--outline"
        onClick={handleBuyNow}
      >
        Buy now
      </button>

      {actionMessage && (
        <p className="pdp-status" role="status">
          {actionMessage}
        </p>
      )}

      <div className="pdp-pincode">
        <label className="pdp-label" htmlFor={pincodeFieldId}>
          Check delivery
        </label>
        <div className="pdp-pincode-row">
          <input
            id={pincodeFieldId}
            className="pdp-pincode-input"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="Enter pincode"
            value={pincode}
            onChange={(event) => {
              setPincode(event.target.value);
              setDeliveryMessage(null);
            }}
          />
          <button
            type="button"
            className="pdp-btn pdp-btn--check"
            onClick={handlePincodeCheck}
          >
            Check
          </button>
        </div>
        {deliveryMessage && (
          <p className="pdp-status">{deliveryMessage}</p>
        )}
      </div>

      <p className="pdp-value-line">
        Standard shipping on qualifying orders across India.
      </p>

      <div className="pdp-accordions">
        <div className="pdp-accordion">
          <button
            type="button"
            className="pdp-accordion-trigger"
            aria-expanded={openAccordion === "details"}
            onClick={() => toggleAccordion("details")}
          >
            Product details
          </button>
          {openAccordion === "details" && (
            <div className="pdp-accordion-panel">
              <dl className="pdp-detail-list">
                {detailRows.map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        <div className="pdp-accordion">
          <button
            type="button"
            className="pdp-accordion-trigger"
            aria-expanded={openAccordion === "shipping"}
            onClick={() => toggleAccordion("shipping")}
          >
            Shipping
          </button>
          {openAccordion === "shipping" && (
            <div className="pdp-accordion-panel">
              <p>
                Orders ship within 2–4 business days. Tracking
                details are shared by email once your order leaves
                our warehouse.
              </p>
            </div>
          )}
        </div>

        <div className="pdp-accordion">
          <button
            type="button"
            className="pdp-accordion-trigger"
            aria-expanded={openAccordion === "reviews"}
            onClick={() => toggleAccordion("reviews")}
          >
            Reviews
          </button>
          {openAccordion === "reviews" && (
            <div className="pdp-accordion-panel">
              <p>No reviews yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

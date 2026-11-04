"use client";

import { useState, type FormEvent } from "react";

import { ContentPage } from "@/components/ContentPage";

export function ContactPageContent() {
  const [message, setMessage] = useState<string | null>(
    null
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      "Contact form is not connected to a backend yet. Your message was not sent."
    );
  }

  return (
    <ContentPage
      title="Contact"
      lede="Questions about sizing, orders, or the catalog? Reach out below."
    >
      <p>
        Email:{" "}
        <a href="mailto:hello@mohrbaugh.example">
          hello@mohrbaugh.example
        </a>{" "}
        (placeholder)
      </p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input type="text" name="name" required />
        </label>
        <label>
          Email
          <input type="email" name="email" required />
        </label>
        <label>
          Message
          <textarea name="message" rows={5} required />
        </label>
        <button type="submit" className="content-btn">
          Send message (preview)
        </button>
        {message ? (
          <p className="content-note" role="status">
            {message}
          </p>
        ) : null}
      </form>
    </ContentPage>
  );
}

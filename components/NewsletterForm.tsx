"use client";

export function NewsletterForm() {
  return (
    <form
      className="newsletter-form"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <label className="visually-hidden" htmlFor="newsletter-email">
        Email
      </label>
      <input
        type="email"
        id="newsletter-email"
        name="email"
        placeholder="Your email"
        required
      />
      <button type="submit">Join</button>
    </form>
  );
}

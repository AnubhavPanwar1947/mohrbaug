import localFont from "next/font/local";

/**
 * After adding licensed GTAmerica-*.woff2 under public/fonts/, import this in
 * app/layout.tsx and set:
 *   <html className={`${gtAmerica.variable} ${gtAmerica.className}`}>
 * Then point --font-sans / --font-display at var(--font-gt-america, "GT America"), Arial, sans-serif.
 * Until those files exist, globals.css @font-face serves the same paths with an Arial fallback.
 */
export const gtAmerica = localFont({
  src: [
    {
      path: "../../public/fonts/GTAmerica-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GTAmerica-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GTAmerica-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-gt-america",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

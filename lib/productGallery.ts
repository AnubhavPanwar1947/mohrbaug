import type { ApiProduct } from "@/lib/recommendationApi";

const MIN_GALLERY_IMAGES = 7;

function normalizeUrl(url: unknown): string | null {
  if (typeof url !== "string") {
    return null;
  }

  const trimmed = url.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export function buildProductGalleryImages(
  product: Pick<ApiProduct, "imageUrl" | "imageUrls">
): string[] {
  const primary = normalizeUrl(product.imageUrl);
  const seen = new Set<string>();
  const urls: string[] = [];

  function pushUnique(candidate: unknown) {
    const normalized = normalizeUrl(candidate);

    if (!normalized || seen.has(normalized)) {
      return;
    }

    seen.add(normalized);
    urls.push(normalized);
  }

  pushUnique(primary);

  for (const extra of product.imageUrls ?? []) {
    pushUnique(extra);
  }

  if (urls.length >= MIN_GALLERY_IMAGES) {
    return urls;
  }

  if (!primary) {
    return urls;
  }

  while (urls.length < MIN_GALLERY_IMAGES) {
    urls.push(primary);
  }

  return urls;
}

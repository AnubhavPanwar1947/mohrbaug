"use client";

import { useEffect, useState } from "react";

const FALLBACK_IMAGE = "/images/product-placeholder.svg";

type ProductImageProps = {
  src?: string;
  alt: string;
  width: number;
  height: number;
  loading?: "lazy" | "eager";
  className?: string;
};

export function ProductImage({
  src,
  alt,
  width,
  height,
  loading = "lazy",
  className,
}: ProductImageProps) {
  const [imageSrc, setImageSrc] = useState(
    src || FALLBACK_IMAGE
  );

  useEffect(() => {
    setImageSrc(src || FALLBACK_IMAGE);
  }, [src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={className}
      onError={() => setImageSrc(FALLBACK_IMAGE)}
    />
  );
}
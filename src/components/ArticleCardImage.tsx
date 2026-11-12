"use client";

import Image from "next/image";
import { useState } from "react";

interface IArticleCardImageProps {
  src?: string;
  alt: string;
  sizes: string;
  compact?: boolean;
  label?: string;
}

export const ArticleCardImage = (props: IArticleCardImageProps) => {
  const { src, alt, sizes, compact = false, label } = props;
  const [failedSrc, setFailedSrc] = useState<string>();
  const [loadedSrc, setLoadedSrc] = useState<string>();
  const loaded = loadedSrc === src;
  const height = compact ? "aspect-[16/10]" : "aspect-[16/9]";

  if (!src || failedSrc === src) {
    return (
      <div className={`relative overflow-hidden border-b border-line bg-page ${height}`}>
        <Image src="/brand/fallback.png" alt="Bola de Domingo" fill sizes={sizes} className="object-contain" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden border-b border-line bg-page ${height}`}>
      {!loaded ? <div className="absolute inset-0 animate-pulse bg-line" /> : null}
      {label ? (
        <span className="utility-label-soft absolute top-3 left-3 z-10 rounded-sm bg-panel/85 px-2 py-1 text-[10px] font-semibold text-accent shadow-sm backdrop-blur-sm">
          {label}
        </span>
      ) : null}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        unoptimized
        className={`object-cover transition duration-300 group-hover:scale-[1.03] ${loaded ? "opacity-100" : "opacity-0"}`}
        onError={() => setFailedSrc(src)}
        onLoad={() => setLoadedSrc(src)}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/12 to-transparent" />
    </div>
  );
};
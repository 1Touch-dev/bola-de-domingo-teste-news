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
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const height = compact ? "aspect-[16/10]" : "aspect-[16/9]";

  if (!src || failed) {
    return (
      <div className={`relative flex items-end overflow-hidden border-b border-line bg-gradient-to-br from-page via-panel to-page p-4 ${height}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(154,52,18,0.16),transparent_45%)]" />
        <div className="relative">
          {label ? <span className="utility-label-soft mb-2 inline-block bg-panel/80 px-2 py-1 text-[10px] font-semibold text-highlight">{label}</span> : null}
          <span className="mb-2 inline-grid size-10 place-items-center rounded-sm bg-asphalt text-sm font-semibold text-panel shadow-sm">BD</span>
          <span className="utility-label-soft inline-block rounded-sm bg-accent/10 px-2 py-1 text-[10px] font-semibold text-accent">Sem imagem</span>
        </div>
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
        onError={() => setFailed(true)}
        onLoad={() => setLoaded(true)}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/12 to-transparent" />
    </div>
  );
};
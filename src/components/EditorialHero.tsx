"use client";

import { AffiliatePlacement } from "@/components/affiliate/AffiliatePlacement";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { IEditorialBanner } from "@/lib/banners";
import { prepareBannerHtml, sameSitePath } from "@/lib/bannerLinks";

interface IEditorialHeroProps {
  banners: IEditorialBanner[];
}

const heroFitStyle =
  "<style>html,body{margin:0;height:100%;overflow:hidden;background:#050415}.banner-slider,.banner-slide,.banner-link,.banner-image-wrapper{height:100%!important;width:100%!important;max-height:100%!important;aspect-ratio:auto!important;margin:0!important;border:0!important;border-radius:0!important;box-shadow:none!important}</style>";

const Frame = (props: { banner: IEditorialBanner }) => {
  const { banner } = props;
  if (banner.type === "html") {
    return (
      <iframe
        className="block h-full w-full overflow-hidden border-0"
        title={banner.title || "Destaque"}
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        scrolling="no"
        srcDoc={`${heroFitStyle}${prepareBannerHtml(banner.htmlContent)}`}
      />
    );
  }

  const image = (
    <Image src={banner.url} alt={banner.title || ""} fill priority sizes="(max-width: 1152px) 100vw, 1152px" className="object-cover" />
  );
  const caption = (
    <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
      {banner.title ? <span className="block text-lg font-semibold">{banner.title}</span> : null}
      {banner.description ? <span className="mt-1 block truncate text-sm">{banner.description}</span> : null}
      {banner.ctaLabel && banner.ctaUrl ? (
        <span className="mt-2 inline-block bg-white px-3 py-1 text-xs font-semibold tracking-wide text-black uppercase">{banner.ctaLabel}</span>
      ) : null}
    </span>
  );

  if (banner.ctaUrl) {
    const ctaHref = sameSitePath(banner.ctaUrl) ?? banner.ctaUrl;
    return (
      <a href={ctaHref} className="relative block h-full w-full">
        {image}
        {caption}
      </a>
    );
  }

  return (
    <div className="relative h-full w-full">
      {image}
      {caption}
    </div>
  );
};

export const EditorialHero = (props: IEditorialHeroProps) => {
  const { banners } = props;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || banners.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % banners.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [paused, banners.length]);

  if (banners.length === 0) return null;
  const current = banners[index] ?? banners[0];

  return (
    <div
      className="bg-page"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto w-full max-w-6xl px-5 pt-6 sm:px-8">
        <div className="relative aspect-[3/1] overflow-hidden rounded-[20px] bg-asphalt">
          <Frame banner={current} />
        </div>
        {banners.length > 1 ? (
          <div className="mt-3 flex items-center justify-center gap-2">
            {banners.map((banner, dot) => (
              <button
                key={`${banner.title}-${dot}`}
                type="button"
                aria-label={`Slide ${dot + 1}`}
                aria-current={dot === index}
                className={`size-2 rounded-full ${dot === index ? "bg-accent" : "bg-line"}`}
                onClick={() => setIndex(dot)}
              />
            ))}
          </div>
        ) : null}
        <AffiliatePlacement />
      </div>
    </div>
  );
};

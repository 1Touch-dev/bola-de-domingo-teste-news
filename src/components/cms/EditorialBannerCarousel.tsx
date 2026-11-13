"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BANNER_LOGO_SRC, bannerBrandLabel } from "@/lib/banner-html";
import type { EditorialSlide } from "@/lib/banners";

const ROTATE_MS = 7000;

interface IEditorialBannerCarouselProps {
  slides: EditorialSlide[];
}

function BrandFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-asphalt px-6 sm:gap-3">
      <Image
        src={BANNER_LOGO_SRC}
        alt=""
        width={96}
        height={96}
        className="size-14 object-contain opacity-95 sm:size-20"
        priority
      />
      <p className="font-display text-base font-semibold tracking-wide text-panel sm:text-xl">
        {bannerBrandLabel}
      </p>
    </div>
  );
}

function SlideMedia(props: { slide: EditorialSlide }) {
  const { slide } = props;
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(slide.imageUrl) && !failed;

  useEffect(() => {
    setFailed(false);
  }, [slide.id, slide.imageUrl]);

  return (
    <div className="absolute inset-0">
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={slide.imageUrl}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
          onError={() => setFailed(true)}
        />
      ) : (
        <BrandFallback />
      )}
      <div
        className={
          showImage
            ? "absolute inset-0 bg-gradient-to-r from-asphalt/90 via-asphalt/55 to-asphalt/70"
            : "absolute inset-0 bg-gradient-to-t from-asphalt via-asphalt/75 to-transparent"
        }
        aria-hidden
      />
    </div>
  );
}

function SlideBody(props: { slide: EditorialSlide }) {
  const { slide } = props;
  const content = (
    <article className="relative isolate min-h-[220px] overflow-hidden border border-line bg-asphalt sm:min-h-[280px] md:min-h-[320px]">
      <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
        <SlideMedia slide={slide} />
        <div className="absolute inset-0 flex flex-col justify-end gap-2 p-4 pb-12 sm:gap-3 sm:p-8 sm:pb-14 md:p-10 md:pb-16">
          {slide.category ? (
            <p className="utility-label inline-flex w-fit max-w-full bg-panel/15 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-panel backdrop-blur-sm sm:text-[11px]">
              {slide.category}
            </p>
          ) : null}
          <h2 className="max-w-3xl font-display text-[1.35rem] leading-tight font-semibold text-panel [text-wrap:balance] sm:text-3xl md:text-4xl md:leading-[1.08]">
            {slide.title}
          </h2>
          {slide.excerpt ? (
            <p className="line-clamp-2 max-w-2xl text-sm leading-6 text-panel/85 sm:line-clamp-3 sm:text-base sm:leading-7">
              {slide.excerpt}
            </p>
          ) : null}
          {slide.meta ? (
            <p className="text-[11px] font-medium tracking-wide text-panel/70 sm:text-xs">{slide.meta}</p>
          ) : null}
        </div>
      </div>
    </article>
  );

  if (!slide.href) return content;

  return (
    <a
      href={slide.href}
      className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      {...(slide.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {content}
    </a>
  );
}

function Chevron(props: { dir: "left" | "right" }) {
  const { dir } = props;
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-4 w-4">
      <path
        d={dir === "left" ? "M12.5 4.5 7 10l5.5 5.5" : "M7.5 4.5 13 10l-5.5 5.5"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function EditorialBannerCarousel(props: IEditorialBannerCarouselProps) {
  const { slides } = props;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = slides.length;
  const multi = total > 1;
  const slide = slides[index] ?? slides[0];

  useEffect(() => {
    if (!multi || paused) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [multi, paused, total]);

  if (!slide) return null;

  const go = (next: number) => setIndex(((next % total) + total) % total);

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Destaques em banner"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setPaused(false);
      }}
    >
      <div key={slide.id} aria-live="polite" aria-atomic="true" className="min-w-0">
        <SlideBody slide={slide} />
      </div>

      {multi ? (
        <>
          <button
            type="button"
            aria-label="Banner anterior"
            onClick={() => go(index - 1)}
            className="absolute top-1/2 left-2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-panel/30 bg-asphalt/80 text-panel backdrop-blur-sm transition hover:bg-asphalt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:left-3 sm:h-10 sm:w-10"
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            aria-label="Próximo banner"
            onClick={() => go(index + 1)}
            className="absolute top-1/2 right-2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-panel/30 bg-asphalt/80 text-panel backdrop-blur-sm transition hover:bg-asphalt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:right-3 sm:h-10 sm:w-10"
          >
            <Chevron dir="right" />
          </button>

          <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 sm:bottom-4">
            <span className="bg-asphalt/75 px-2.5 py-1 text-[11px] font-semibold tabular-nums tracking-wide text-panel">
              {index + 1} / {total}
            </span>
            <div className="pointer-events-auto hidden max-w-[min(100%,16rem)] items-center gap-1.5 overflow-x-auto sm:flex">
              {slides.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Ir para banner ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  className={`h-1.5 shrink-0 transition-all ${
                    i === index ? "w-5 bg-accent" : "w-1.5 bg-panel/55 hover:bg-panel/80"
                  }`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

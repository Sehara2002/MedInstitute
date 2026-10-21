"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PosterSlide {
  src: StaticImageData | string;
  href: string;
  alt: string;
  /** Marks the slide as featured and names it, e.g. "Featured workshop" */
  badge?: string;
  /** For images served by the LMS backend (signed redirects) that next/image cannot optimise */
  unoptimized?: boolean;
  /** Tags hanging off the poster's corners while this slide is showing */
  cornerTags?: { topLeft?: string; bottomRight?: string };
}

interface PosterSlideshowProps {
  slides: PosterSlide[];
  intervalMs?: number;
  className?: string;
}

/**
 * Posters that fade into each other in a fixed 4:5 frame. Every poster is shown whole (never
 * cropped) over a blurred copy of itself, so posters of different shapes never leave a gap.
 * Auto-advance pauses on hover or focus and is off for visitors who prefer reduced motion.
 */
export function PosterSlideshow({ slides, intervalMs = 5000, className }: PosterSlideshowProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const count = slides.length;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused || reducedMotion) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), intervalMs);
    return () => clearInterval(timer);
  }, [count, paused, reducedMotion, intervalMs]);

  return (
    <div
      className="w-full"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured posters"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative">
      <div
        className={cn(
          "relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-ink-900 transition-shadow",
          className,
          slides[index]?.badge && "ring-2 ring-amber-400 shadow-[0_0_0_4px_rgb(251_191_36/0.25)]"
        )}
      >
      {slides.map((slide, i) => {
        const active = i === index;
        return (
          <Link
            key={i}
            href={slide.href}
            aria-hidden={!active}
            tabIndex={active ? 0 : -1}
            className={cn(
              "absolute inset-0 block transition-opacity duration-700 ease-in-out motion-reduce:transition-none",
              active ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <Image
              src={slide.src}
              alt=""
              aria-hidden="true"
              fill
              sizes="(max-width: 768px) 90vw, 480px"
              unoptimized={slide.unoptimized}
              className="scale-125 object-cover opacity-80 blur-2xl"
            />
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 768px) 90vw, 480px"
              unoptimized={slide.unoptimized}
              className="object-contain"
            />
            {slide.badge && (
              <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-950 shadow-md">
                <Star className="h-3.5 w-3.5 fill-amber-900/80" aria-hidden="true" />
                {slide.badge}
              </span>
            )}
          </Link>
        );
      })}

      </div>
      {slides[index]?.cornerTags?.topLeft && (
        <span className="absolute -left-2 -top-3 z-20 inline-flex items-center rounded-full bg-red-600 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg ring-2 ring-white sm:-left-4">
          {slides[index].cornerTags?.topLeft}
        </span>
      )}
      {slides[index]?.cornerTags?.bottomRight && (
        <span className="absolute -bottom-3 -right-2 z-20 inline-flex items-center rounded-full bg-medical-green-600 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-lg ring-2 ring-white sm:-right-4">
          {slides[index].cornerTags?.bottomRight}
        </span>
      )}
      </div>

      {/* Controls sit below the poster so they never cover its text */}
      {count > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous poster"
            className="rounded-full bg-white p-1.5 text-ink-700 shadow-soft ring-1 ring-ink-100 transition-colors hover:bg-medical-green-50 hover:text-medical-green-800"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show poster ${i + 1} of ${count}`}
                aria-current={i === index}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index ? "w-6 bg-medical-green-600" : "w-2 bg-ink-300 hover:bg-medical-green-400"
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next poster"
            className="rounded-full bg-white p-1.5 text-ink-700 shadow-soft ring-1 ring-ink-100 transition-colors hover:bg-medical-green-50 hover:text-medical-green-800"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

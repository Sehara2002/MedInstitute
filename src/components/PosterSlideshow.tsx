"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PosterSlide {
  src: StaticImageData | string;
  href: string;
  alt: string;
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
      className={cn("group relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-ink-900", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured posters"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
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
              className="scale-125 object-cover opacity-80 blur-2xl"
            />
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 768px) 90vw, 480px"
              className="object-contain"
            />
          </Link>
        );
      })}

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous poster"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-ink-800 shadow-lift ring-1 ring-ink-100 transition-opacity hover:bg-white focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next poster"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-ink-800 shadow-lift ring-1 ring-ink-100 transition-opacity hover:bg-white focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-ink-900/60 px-3 py-1.5 backdrop-blur-sm">
            {slides.map((slide, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show poster ${i + 1} of ${count}`}
                aria-current={i === index}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

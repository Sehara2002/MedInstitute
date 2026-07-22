"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";

interface FlipCardProps {
  frontSrc: StaticImageData | string;
  frontHref: string;
  frontAlt: string;
  backSrc: StaticImageData | string;
  backHref: string;
  backAlt: string;
  intervalMs?: number;
  transitionMs?: number;
}

export function FlipCard({
  frontSrc,
  frontHref,
  frontAlt,
  backSrc,
  backHref,
  backAlt,
  intervalMs = 6000,
  transitionMs = 1400,
}: FlipCardProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // Keep incrementing forward instead of toggling back to 0 —
      // this makes it feel like one continuous spin rather than a snap-back flip
      setRotation((r) => r + 180);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  const showingFront = Math.round(rotation / 180) % 2 === 0;

  return (
    <div className="w-full" style={{ perspective: "1800px" }}>
      <div
        className="relative w-full ease-in-out"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateY(${rotation}deg)`,
          transitionProperty: "transform",
          transitionDuration: `${transitionMs}ms`,
        }}
      >
        {/* Front face */}
        <Link
          href={frontHref}
          className="block rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            pointerEvents: showingFront ? "auto" : "none",
          }}
        >
          <Image
            src={frontSrc}
            alt={frontAlt}
            width={520}
            height={674}
            priority
            className="w-full h-auto object-cover"
          />
        </Link>

        {/* Back face — positioned exactly over the front, flipped 180° */}
        <Link
          href={backHref}
          className="absolute inset-0 block rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            pointerEvents: showingFront ? "none" : "auto",
          }}
        >
          <Image
            src={backSrc}
            alt={backAlt}
            width={520}
            height={674}
            className="w-full h-auto object-cover"
          />
        </Link>
      </div>
    </div>
  );
}
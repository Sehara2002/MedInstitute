"use client";

import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseCoverImageProps {
    /** Cover URL; nothing (or a failed load) shows the course's gradient instead */
    src: string | null;
    alt?: string;
    /** Size and shape of the frame, e.g. "absolute inset-0" or "w-full aspect-[16/6] rounded-2xl" */
    className?: string;
    /** Gradient classes shown when there is no usable image */
    fallbackClassName?: string;
    /** Load at once (hero images) instead of lazily */
    eager?: boolean;
}

/**
 * A course cover shown whole, never cropped: the image is fitted inside the frame and a blurred
 * copy of it fills the remaining space. If it cannot be loaded, the course's gradient and a
 * graduation cap are shown instead of a broken image.
 *
 * Covers are redirects to short-lived signed URLs, so they bypass next/image.
 */
export function CourseCoverImage({ src, alt = "", className, fallbackClassName, eager = false }: CourseCoverImageProps) {
    // Remember which URL failed, so a new cover is tried again
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    const showImage = src !== null && failedSrc !== src;

    return (
        <div className={cn("relative overflow-hidden", !showImage && fallbackClassName, className)}>
            {showImage ? (
                <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={src}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-xl"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={src}
                        alt={alt}
                        loading={eager ? "eager" : "lazy"}
                        className="relative h-full w-full object-contain"
                        onError={() => setFailedSrc(src)}
                    />
                </>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/30 backdrop-blur-md rounded-full p-2.5">
                        <GraduationCap className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                </div>
            )}
        </div>
    );
}

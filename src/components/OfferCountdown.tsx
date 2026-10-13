"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface OfferCountdownProps {
    /** ISO time the offer ends */
    endsAt: string;
    className?: string;
    /** "pill" for cards, "inline" for running text */
    variant?: "pill" | "inline";
}

function remaining(endsAt: string, now: number): string | null {
    const ms = Date.parse(endsAt) - now;
    if (!(ms > 0)) return null;
    const minutes = Math.floor(ms / 60000);
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    const mins = minutes % 60;
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${Math.max(1, mins)}m`;
}

/**
 * "Ends in 2d 4h" for a limited-time offer. Ticks every 30 seconds and switches to
 * "Offer ended" when the time is up. The server re-checks the price before payment,
 * so this is only a guide for the visitor.
 */
export function OfferCountdown({ endsAt, className, variant = "pill" }: OfferCountdownProps) {
    // Rendered on the server without a clock, filled in on the client to avoid a hydration mismatch
    const [now, setNow] = useState<number | null>(null);

    useEffect(() => {
        const tick = () => setNow(Date.now());
        const first = setTimeout(tick, 0);
        const id = setInterval(tick, 30_000);
        return () => {
            clearTimeout(first);
            clearInterval(id);
        };
    }, []);

    const left = now === null ? null : remaining(endsAt, now);
    const ended = now !== null && left === null;
    const endsOn = new Date(endsAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

    const text = ended ? "Offer ended" : left ? `Ends in ${left}` : "Limited time";

    if (variant === "inline") {
        return (
            <span className={className} title={`Offer ends ${endsOn}`}>
                {text}
            </span>
        );
    }

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm",
                ended ? "bg-gray-200 text-gray-600" : "bg-white text-rose-600 ring-1 ring-rose-200",
                className
            )}
            title={`Offer ends ${endsOn}`}
            aria-live="polite"
        >
            <Timer className="h-3.5 w-3.5" aria-hidden="true" />
            {text}
        </span>
    );
}

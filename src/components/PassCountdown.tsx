"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";

function describe(ms: number): string {
    const totalMinutes = Math.max(0, Math.ceil(ms / 60000));
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    if (days > 0) return `${days} day${days === 1 ? "" : "s"} ${hours} h`;
    if (hours > 0) return `${hours} h ${minutes} min`;
    return `${minutes} min`;
}

/**
 * Counts down to the moment the join link appears, and reloads the page then so
 * the guest does not have to. Also reloads once a minute close to that moment.
 */
export function PassCountdown({ opensAt }: { opensAt: string }) {
    const router = useRouter();
    const target = new Date(opensAt).getTime();
    const [remaining, setRemaining] = useState<number | null>(null);

    useEffect(() => {
        const tick = () => {
            const left = target - Date.now();
            setRemaining(left);
            if (left <= 0) router.refresh();
        };
        tick();
        const interval = setInterval(tick, 30000);
        return () => clearInterval(interval);
    }, [target, router]);

    if (remaining === null) return null;
    return (
        <p className="inline-flex items-center gap-2 rounded-full bg-medical-green-50 px-4 py-2 text-sm font-semibold text-medical-green-800 ring-1 ring-medical-green-100">
            <Clock className="h-4 w-4" aria-hidden="true" />
            The join button appears in {describe(remaining)}
        </p>
    );
}

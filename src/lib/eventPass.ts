// A guest's personal session link: /join/<token>. The link identifies the guest (it is their
// booking's secret) and opens exactly one online workshop or mock exam. It is read from the
// LMS backend, which decides what the link may show and when it stops working.

import { lmsFetch } from "@/lib/lms";

export type PassState = "UPCOMING" | "LIVE" | "ENDED" | "DEACTIVATED";

export interface EventPass {
    state: PassState;
    kind: "workshop" | "mock_exam";
    participant: {
        firstName: string;
        lastName: string | null;
        email: string;
        slotNumber: number | null;
    };
    event: {
        title: string;
        description: string | null;
        venue: string;
        startsAt: string;
        endsAt: string;
        /** Backend path (no origin) of the poster image, or null */
        posterUrl: string | null;
    };
    /** When the join link appears: 30 minutes before the start */
    opensAt: string;
    /** Only present while the session is open to join */
    joinUrl: string | null;
}

export type PassLookup = { status: "ok"; pass: EventPass } | { status: "not_found" } | { status: "unavailable" };

const TOKEN = /^[wm]_[A-Za-z0-9_-]{24,64}$/;

/** The pass behind a link, or why there is none. Never throws. */
export async function getPass(token: string): Promise<PassLookup> {
    // Anything that cannot be a token never reaches the backend
    if (!TOKEN.test(token)) return { status: "not_found" };

    const result = await lmsFetch<EventPass>(`/public/event-pass/${token}`);
    if (result.status === "ok") return { status: "ok", pass: result.data };
    if (result.status === "error" && result.httpStatus === 404) return { status: "not_found" };
    return { status: "unavailable" };
}

/** Sri Lanka, where the sessions are held */
const TIMEZONE = "Asia/Colombo";

export function formatSessionDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-GB", {
        timeZone: TIMEZONE,
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export function formatSessionTime(iso: string): string {
    return new Date(iso).toLocaleTimeString("en-US", { timeZone: TIMEZONE, hour: "numeric", minute: "2-digit" });
}

export const KIND_LABEL: Record<EventPass["kind"], string> = {
    workshop: "workshop",
    mock_exam: "mock exam",
};

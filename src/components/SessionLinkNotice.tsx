"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

type Kind = "workshop" | "mock_exam";

interface SessionLinkNoticeProps {
    kind: Kind;
    reference: string;
    email: string;
}

/**
 * Shown on the confirmation page of an online session. A website guest joins through a
 * personal link sent by email; if the email is lost they can have it sent again.
 */
export function SessionLinkNotice({ kind, reference, email }: SessionLinkNoticeProps) {
    const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [message, setMessage] = useState("");
    const noun = kind === "workshop" ? "workshop" : "mock exam";
    const path = kind === "workshop" ? "workshop-bookings" : "mock-exam-bookings";

    async function resend() {
        setState("sending");
        try {
            const res = await fetch(`/api/lms/public/${path}/${encodeURIComponent(reference)}/resend-pass`, { method: "POST" });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setState("error");
                setMessage(json?.message || "We could not send the link. Please try again shortly.");
                return;
            }
            setState("sent");
            setMessage(`We sent a new link to ${email}. The earlier link no longer works.`);
        } catch {
            setState("error");
            setMessage("We could not reach the server. Please try again shortly.");
        }
    }

    return (
        <div className="mb-6 rounded-xl border border-medical-blue-200 bg-medical-blue-50 p-5 text-left text-sm">
            <p className="flex items-center gap-2 font-semibold text-medical-blue-800">
                <Mail className="h-4 w-4" aria-hidden="true" />
                This {noun} is held online
            </p>
            <p className="mt-1.5 leading-relaxed text-ink-700">
                We emailed your personal link to <strong>{email}</strong>. Open it to join. It identifies you automatically, works for this {noun} only, and
                stops working shortly after it ends.
            </p>
            {state === "sent" || state === "error" ? (
                <p role="status" className={`mt-3 font-medium ${state === "sent" ? "text-medical-green-700" : "text-red-700"}`}>
                    {message}
                </p>
            ) : null}
            <button
                type="button"
                onClick={resend}
                disabled={state === "sending" || state === "sent"}
                className="mt-3 font-semibold text-medical-blue-700 underline underline-offset-2 hover:text-medical-blue-800 disabled:opacity-50"
            >
                {state === "sending" ? "Sending…" : "Can’t find the email? Send my link again"}
            </button>
        </div>
    );
}

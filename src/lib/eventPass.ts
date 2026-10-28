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
    /** Whether the session has a link to join at all */
    hasJoinLink?: boolean;
    exam?: ExamInfo;
}

/** One sitting of an online exam, as the guest's page shows it */
export interface ExamSittingInfo {
    status: "IN_PROGRESS" | "SUBMITTED";
    startedAt: string;
    deadlineAt: string;
    submittedAt: string | null;
    score: number | null;
    totalMarks: number | null;
    percentage: number | null;
    passed: boolean | null;
}

/** Present on a pass whose mock exam is answered in the system */
export interface ExamInfo {
    enabled: true;
    /** NOT_OPEN until the start time, OPEN until the end time, then CLOSED */
    phase: "NOT_OPEN" | "OPEN" | "CLOSED";
    startsAt: string;
    closesAt: string;
    /** The server's clock when this was read, so the page can run the timer on server time */
    serverNow: string;
    totalQuestions: number;
    durationMins: number | null;
    passMarkPercent: number | null;
    showAnswersAfter: boolean;
    sitting: ExamSittingInfo | null;
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

// ── Taking the exam (called from the browser through this site's /api/lms proxy) ──

export interface ExamQuestion {
    questionId: number;
    order: number;
    questionText: string;
    questionType: string;
    marks: number;
    options: { optionId: number; optionText: string }[];
}

export interface ExamSession {
    serverNow: string;
    sitting: ExamSittingInfo;
    durationMins: number | null;
    questions: ExamQuestion[];
    /** Answers already saved: question id -> option id */
    answers: Record<string, number>;
}

export interface ReviewOption {
    option_id: number;
    option_text: string;
    is_correct: boolean;
    is_selected: boolean;
    explanation: string | null;
}

export interface ReviewQuestion {
    question_id: number;
    question_order: number;
    question_text: string;
    question_type: string;
    marks: number;
    explanation: string | null;
    status: "correct" | "incorrect" | "unanswered";
    selected_option_id: number | null;
    options: ReviewOption[];
}

export interface ExamReviewData {
    summary: { total: number; correct: number; incorrect: number; unanswered: number };
    questions: ReviewQuestion[];
}

export interface ExamResult {
    status: "SUBMITTED";
    submittedAt: string;
    score: number;
    totalMarks: number;
    percentage: number;
    passMarkPercent: number | null;
    passed: boolean | null;
    /** Null when the exam does not show answers afterwards */
    review: ExamReviewData | null;
}

export class ExamApiError extends Error {
    constructor(message: string, public status: number) {
        super(message);
    }
}

async function examCall<T>(token: string, path: string, body?: unknown): Promise<T> {
    let res: Response;
    try {
        res = await fetch(`/api/lms/public/event-pass/${encodeURIComponent(token)}${path}`, {
            method: body === undefined && path.endsWith("/result") ? "GET" : "POST",
            headers: { "Content-Type": "application/json" },
            body: body === undefined ? undefined : JSON.stringify(body),
            cache: "no-store",
        });
    } catch {
        throw new ExamApiError("We could not reach the server. Please check your connection.", 0);
    }
    const json = await res.json().catch(() => null);
    if (!res.ok || !json || json.success === false) {
        throw new ExamApiError(json?.message || "Something went wrong. Please try again.", res.status);
    }
    return json.data as T;
}

/** Start the exam, or carry on with a sitting in progress */
export const startExam = (token: string) => examCall<ExamSession>(token, "/exam/start", {});
/** Save one answer; null clears it */
export const saveExamAnswer = (token: string, questionId: number, selectedOptionId: number | null) =>
    examCall<{ saved: true }>(token, "/exam/answer", { questionId, selectedOptionId });
export const submitExam = (token: string) => examCall<ExamResult>(token, "/exam/submit", {});
export const getExamResult = (token: string) => examCall<ExamResult>(token, "/exam/result");

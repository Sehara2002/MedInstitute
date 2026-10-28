"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Clock, Loader2, ShieldAlert, Trophy, XCircle } from "lucide-react";
import { ExamReview } from "@/components/exam/ExamReview";
import { PassCountdown } from "@/components/PassCountdown";
import {
    ExamApiError,
    getExamResult,
    saveExamAnswer,
    startExam,
    submitExam,
    type ExamInfo,
    type ExamResult,
    type ExamSession,
} from "@/lib/eventPass";

interface OnlineExamPlayerProps {
    token: string;
    title: string;
    participantName: string;
    info: ExamInfo;
    /** The guest's session page, to go back to */
    backHref: string;
}

type Stage = "loading" | "intro" | "exam" | "result" | "blocked";

function formatClock(ms: number): string {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/** Keep the questions from being copied: a deterrent for casual copying, not a lock */
const deterCopy = { onCopy: (e: React.ClipboardEvent) => e.preventDefault(), onContextMenu: (e: React.MouseEvent) => e.preventDefault() };

export function OnlineExamPlayer({ token, title, participantName, info, backHref }: OnlineExamPlayerProps) {
    const [stage, setStage] = useState<Stage>("loading");
    const [session, setSession] = useState<ExamSession | null>(null);
    const [result, setResult] = useState<ExamResult | null>(null);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [index, setIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [starting, setStarting] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [remainingMs, setRemainingMs] = useState<number | null>(null);
    const [unsaved, setUnsaved] = useState<Set<number>>(new Set());

    const offsetRef = useRef(0); // server time minus this device's time
    const saveChain = useRef<Promise<unknown>>(Promise.resolve());
    const finishing = useRef(false);

    /** The exam is over (handed in, or time ran out): show the result */
    const showResult = useCallback((data: ExamResult) => {
        setResult(data);
        setStage("result");
        setConfirmOpen(false);
    }, []);

    const finish = useCallback(async () => {
        if (finishing.current) return;
        finishing.current = true;
        setSubmitting(true);
        setError(null);
        try {
            await saveChain.current.catch(() => undefined); // let any answer still being saved land first
            showResult(await submitExam(token));
        } catch (err) {
            finishing.current = false;
            // A sitting that already ended has a result to show
            try {
                showResult(await getExamResult(token));
                finishing.current = true;
            } catch {
                setError(err instanceof Error ? err.message : "We could not hand in your exam. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    }, [token, showResult]);

    const begin = useCallback(async () => {
        setStarting(true);
        setError(null);
        try {
            const data = await startExam(token);
            offsetRef.current = Date.parse(data.serverNow) - Date.now();
            setSession(data);
            setAnswers(Object.fromEntries(Object.entries(data.answers).map(([q, o]) => [Number(q), o])));
            setIndex(0);
            setStage("exam");
        } catch (err) {
            if (err instanceof ExamApiError && err.status === 409) {
                // Already handed in, or time ran out: there is a result
                try {
                    showResult(await getExamResult(token));
                    return;
                } catch {
                    /* fall through to the message */
                }
            }
            setError(err instanceof Error ? err.message : "We could not start the exam.");
            setStage("blocked");
        } finally {
            setStarting(false);
        }
    }, [token, showResult]);

    // First screen: a result, a sitting to resume, the start button, or why it cannot be started
    useEffect(() => {
        if (info.sitting?.status === "SUBMITTED") {
            getExamResult(token).then(showResult, (err: Error) => {
                setError(err.message);
                setStage("blocked");
            });
        } else if (info.sitting?.status === "IN_PROGRESS") {
            void begin();
        } else if (info.phase === "OPEN") {
            setStage("intro");
        } else {
            setStage("blocked");
        }
        // Only on the first load
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // The clock runs on the server's time, so a wrong device clock changes nothing
    useEffect(() => {
        if (stage !== "exam" || !session) return;
        const deadline = Date.parse(session.sitting.deadlineAt);
        const tick = () => {
            const left = deadline - (Date.now() + offsetRef.current);
            setRemainingMs(left);
            if (left <= 0) void finish();
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [stage, session, finish]);

    // Warn before leaving a sitting that is under way
    useEffect(() => {
        if (stage !== "exam") return;
        const warn = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [stage]);

    const save = useCallback(
        (questionId: number, optionId: number | null) => {
            saveChain.current = saveChain.current
                .catch(() => undefined)
                .then(() => saveExamAnswer(token, questionId, optionId))
                .then(() =>
                    setUnsaved((prev) => {
                        if (!prev.has(questionId)) return prev;
                        const next = new Set(prev);
                        next.delete(questionId);
                        return next;
                    })
                )
                .catch((err: unknown) => {
                    if (err instanceof ExamApiError && err.status === 409) {
                        void finish(); // the exam ended while answering
                        return;
                    }
                    setUnsaved((prev) => new Set(prev).add(questionId));
                });
        },
        [token, finish]
    );

    const choose = (questionId: number, optionId: number) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
        save(questionId, optionId);
    };

    const retryUnsaved = () => {
        unsaved.forEach((qid) => save(qid, answers[qid] ?? null));
    };

    // ── Screens ─────────────────────────────────────────────────────────────

    if (stage === "loading") {
        return (
            <div className="flex min-h-[50vh] items-center justify-center text-ink-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" /> Loading your exam…
            </div>
        );
    }

    if (stage === "intro") {
        return (
            <div className="mx-auto max-w-2xl rounded-2xl border border-ink-100 bg-white p-8 shadow-soft">
                <p className="text-sm font-bold uppercase tracking-wider text-medical-green-700">Online exam</p>
                <h1 className="mt-2 font-display text-3xl font-extrabold text-ink-900">{title}</h1>
                <p className="mt-2 text-ink-600">Good luck, {participantName}. Read this before you start.</p>
                <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-ink-50 p-4">
                        <dt className="text-xs text-ink-500">Questions</dt>
                        <dd className="font-display text-2xl font-extrabold text-ink-900">{info.totalQuestions}</dd>
                    </div>
                    <div className="rounded-xl bg-ink-50 p-4">
                        <dt className="text-xs text-ink-500">Time allowed</dt>
                        <dd className="font-display text-2xl font-extrabold text-ink-900">{info.durationMins ? `${info.durationMins} min` : "Until close"}</dd>
                    </div>
                    {info.passMarkPercent !== null && (
                        <div className="rounded-xl bg-ink-50 p-4">
                            <dt className="text-xs text-ink-500">Pass mark</dt>
                            <dd className="font-display text-2xl font-extrabold text-ink-900">{info.passMarkPercent}%</dd>
                        </div>
                    )}
                </dl>
                <ul className="mt-6 space-y-2 text-sm leading-relaxed text-ink-600">
                    <li className="flex gap-2">
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-medical-green-600" aria-hidden="true" />
                        The timer starts when you press Start and cannot be paused.
                        {info.durationMins ? "" : " It ends when the exam closes."}
                    </li>
                    <li className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-medical-green-600" aria-hidden="true" />
                        Your answers are saved as you go. If your connection drops or you refresh, come back to this page and carry on.
                    </li>
                    <li className="flex gap-2">
                        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-medical-green-600" aria-hidden="true" />
                        You can sit this exam once. When time runs out it is handed in for you.
                    </li>
                </ul>
                {error && (
                    <p role="alert" className="mt-4 text-sm font-medium text-red-700">
                        {error}
                    </p>
                )}
                <button type="button" onClick={begin} disabled={starting} className="btn-primary mt-7 w-full !py-3.5 text-base">
                    {starting ? "Starting…" : "Start the exam"}
                </button>
                <Link href={backHref} className="mt-3 block text-center text-sm font-semibold text-ink-500 hover:text-ink-800">
                    Not yet: back to my session page
                </Link>
            </div>
        );
    }

    if (stage === "blocked") {
        return (
            <div className="mx-auto max-w-lg rounded-2xl border border-ink-100 bg-white p-8 text-center shadow-soft">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-50 text-ink-500">
                    <AlertTriangle className="h-7 w-7" aria-hidden="true" />
                </div>
                <h1 className="font-display text-2xl font-extrabold text-ink-900">
                    {info.phase === "NOT_OPEN" ? "The exam hasn’t opened yet" : info.phase === "CLOSED" ? "This exam has closed" : "The exam can’t be started"}
                </h1>
                <p className="mt-3 leading-relaxed text-ink-600">
                    {error ||
                        (info.phase === "NOT_OPEN"
                            ? "Come back to this page at the start time. You don’t need to do anything else."
                            : "The time for this exam is over.")}
                </p>
                {info.phase === "NOT_OPEN" && (
                    <div className="mt-4">
                        <PassCountdown opensAt={info.startsAt} label="The exam opens in" />
                    </div>
                )}
                <Link href={backHref} className="btn-secondary mt-6">
                    Back to my session page
                </Link>
            </div>
        );
    }

    if (stage === "result" && result) {
        const circle = result.passed === null ? "text-medical-blue-600 bg-medical-blue-50" : result.passed ? "text-medical-green-600 bg-medical-green-50" : "text-amber-600 bg-amber-50";
        return (
            <div className="mx-auto max-w-3xl space-y-8">
                <div className="rounded-2xl border border-ink-100 bg-white p-8 text-center shadow-soft">
                    <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${circle}`}>
                        {result.passed === false ? <XCircle className="h-9 w-9" aria-hidden="true" /> : <Trophy className="h-9 w-9" aria-hidden="true" />}
                    </div>
                    <p className="text-sm font-bold uppercase tracking-wider text-ink-500">Exam handed in</p>
                    <h1 className="mt-1 font-display text-3xl font-extrabold text-ink-900">
                        {result.passed === null ? "Your result" : result.passed ? "You passed" : "Not passed this time"}
                    </h1>
                    <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-4">
                        <div className="rounded-xl bg-ink-50 p-4">
                            <p className="text-xs text-ink-500">Score</p>
                            <p className="font-display text-2xl font-extrabold text-ink-900">
                                {result.score} <span className="text-sm font-semibold text-ink-400">/ {result.totalMarks}</span>
                            </p>
                        </div>
                        <div className="rounded-xl bg-ink-50 p-4">
                            <p className="text-xs text-ink-500">Percentage</p>
                            <p className="font-display text-2xl font-extrabold text-ink-900">{result.percentage}%</p>
                            {result.passMarkPercent !== null && <p className="text-[11px] text-ink-400">Pass mark {result.passMarkPercent}%</p>}
                        </div>
                    </div>
                    <p className="mt-5 text-sm text-ink-500">We&apos;ve emailed you a copy of your result. Your link stops working shortly after the exam ends.</p>
                    <Link href={backHref} className="btn-secondary mt-5">
                        Back to my session page
                    </Link>
                </div>
                {result.review ? (
                    <ExamReview review={result.review} />
                ) : (
                    <p className="rounded-2xl border border-ink-100 bg-white p-6 text-center text-sm text-ink-500">
                        The correct answers are not shown for this exam.
                    </p>
                )}
            </div>
        );
    }

    // ── The exam ────────────────────────────────────────────────────────────
    if (!session) return null;
    const questions = session.questions;
    const q = questions[index];
    const answeredCount = Object.keys(answers).length;
    const low = remainingMs !== null && remainingMs < 5 * 60 * 1000;

    return (
        <div>
            <div className="mb-4 flex items-center justify-between gap-4">
                <h1 className="line-clamp-1 font-display text-xl font-extrabold tracking-tight text-ink-900 md:text-2xl">{title}</h1>
                <div
                    role="timer"
                    className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 ${
                        low ? "animate-pulse border-rose-300 bg-rose-50 font-bold text-rose-600" : "border-ink-200 bg-white text-ink-800"
                    }`}
                >
                    <Clock className={`h-4 w-4 ${low ? "text-rose-600" : "text-medical-green-600"}`} aria-hidden="true" />
                    <span className="text-xs font-bold tabular-nums tracking-wide">{remainingMs === null ? "…" : formatClock(remainingMs)} remaining</span>
                </div>
            </div>

            {unsaved.size > 0 && (
                <div role="alert" className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
                    <span>Some answers haven’t been saved yet. Check your connection.</span>
                    <button type="button" onClick={retryUnsaved} className="font-semibold underline underline-offset-2">
                        Try again
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 lg:h-[calc(100dvh-12rem)] lg:min-h-[30rem] lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-6">
                {/* Question */}
                <section className="flex min-w-0 flex-col rounded-2xl border border-ink-100 bg-white shadow-soft lg:min-h-0">
                    <div className="shrink-0 space-y-2.5 border-b border-ink-100 px-5 pb-3.5 pt-4 sm:px-6">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-500">
                                Question {index + 1} of {questions.length}
                            </h2>
                            <span className="text-xs font-semibold text-ink-400">
                                {q.marks} mark{q.marks === 1 ? "" : "s"}
                            </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                            <div className="h-full rounded-full bg-medical-green-600 transition-all duration-300" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 px-5 py-5 sm:px-6 lg:overflow-y-auto" {...deterCopy}>
                        <p className="mb-5 select-none whitespace-pre-line text-base font-medium leading-relaxed text-ink-900 lg:text-[1.05rem]">{q.questionText}</p>
                        <div className="space-y-2.5" role="radiogroup" aria-label={`Answers for question ${index + 1}`}>
                            {q.options.map((option, idx) => {
                                const selected = answers[q.questionId] === option.optionId;
                                return (
                                    <label
                                        key={option.optionId}
                                        className={`flex cursor-pointer select-none items-start gap-3.5 rounded-xl border px-4 py-3 transition-all ${
                                            selected
                                                ? "border-medical-green-500 bg-medical-green-50/70 ring-2 ring-medical-green-500/20"
                                                : "border-ink-100 bg-ink-50/50 hover:border-ink-300"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={`q_${q.questionId}`}
                                            checked={selected}
                                            onChange={() => choose(q.questionId, option.optionId)}
                                            className="mt-0.5 h-4 w-4 cursor-pointer border-ink-300 text-medical-green-600 focus:ring-medical-green-500"
                                        />
                                        <span className="flex-1 text-sm">
                                            <span className={`mr-2 text-xs font-bold ${selected ? "text-medical-green-700" : "text-ink-500"}`}>{String.fromCharCode(65 + idx)}.</span>
                                            <span className={selected ? "font-semibold text-ink-900" : "text-ink-700"}>{option.optionText}</span>
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-between rounded-b-2xl border-t border-ink-100 bg-ink-50/60 px-5 py-3.5 sm:px-6">
                        <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => setIndex((i) => Math.max(0, i - 1))}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-5 py-2.5 text-xs font-bold text-ink-700 transition-colors hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
                        </button>
                        <button
                            type="button"
                            disabled={index === questions.length - 1}
                            onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-5 py-2.5 text-xs font-bold text-ink-700 transition-colors hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </div>
                </section>

                {/* Palette */}
                <aside className="flex flex-col rounded-2xl border border-ink-100 bg-white p-4 shadow-soft lg:min-h-0">
                    <div className="min-h-0 flex-1 lg:overflow-y-auto">
                        <h3 className="mb-3 font-display text-sm font-extrabold text-ink-900">Question palette</h3>
                        <div className="mb-4 flex gap-4 text-[11px] text-ink-600">
                            <span className="flex items-center gap-1.5">
                                <span className="h-3 w-3 rounded bg-medical-green-600" /> Answered
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-3 w-3 rounded border-2 border-medical-green-600 bg-white" /> Current
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-3 w-3 rounded border border-ink-300" /> Not answered
                            </span>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((item, idx) => {
                                const current = idx === index;
                                const answered = answers[item.questionId] !== undefined;
                                return (
                                    <button
                                        key={item.questionId}
                                        type="button"
                                        onClick={() => setIndex(idx)}
                                        aria-label={`Question ${idx + 1}${answered ? ", answered" : ""}`}
                                        aria-current={current}
                                        className={`h-9 rounded-lg text-xs font-bold transition-all ${
                                            current
                                                ? "border-2 border-medical-green-600 bg-white text-medical-green-700 ring-2 ring-medical-green-500/20"
                                                : answered
                                                  ? "bg-medical-green-600 text-white"
                                                  : "bg-ink-100 text-ink-600 hover:bg-ink-200"
                                        }`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="mt-3 shrink-0 border-t border-ink-100 pt-4">
                        <p className="mb-2.5 text-center text-[11px] text-ink-500">
                            {answeredCount} of {questions.length} answered
                        </p>
                        <button type="button" onClick={() => setConfirmOpen(true)} className="btn-primary w-full">
                            <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Hand in the exam
                        </button>
                    </div>
                </aside>
            </div>

            {confirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="hand-in-title">
                    <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-lift">
                        <h2 id="hand-in-title" className="font-display text-lg font-extrabold text-ink-900">
                            Hand in your exam?
                        </h2>
                        <p className="text-sm leading-relaxed text-ink-600">
                            You have answered <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> questions.
                            {answeredCount < questions.length ? " Unanswered questions score nothing." : ""} You can&apos;t change your answers after handing in.
                        </p>
                        {error && (
                            <p role="alert" className="text-sm font-medium text-red-700">
                                {error}
                            </p>
                        )}
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setConfirmOpen(false)} disabled={submitting} className="btn-secondary flex-1">
                                Keep going
                            </button>
                            <button type="button" onClick={() => void finish()} disabled={submitting} className="btn-primary flex-1">
                                {submitting ? "Handing in…" : "Hand in"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, Lightbulb, MinusCircle, XCircle } from "lucide-react";
import type { ExamReviewData, ReviewOption, ReviewQuestion } from "@/lib/eventPass";

type Filter = "all" | ReviewQuestion["status"];

const STATUS = {
    correct: { label: "Correct", badge: "bg-medical-green-50 text-medical-green-800 border-medical-green-200", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    incorrect: { label: "Incorrect", badge: "bg-rose-50 text-rose-700 border-rose-200", icon: <XCircle className="h-3.5 w-3.5" /> },
    unanswered: { label: "Not answered", badge: "bg-amber-50 text-amber-800 border-amber-200", icon: <MinusCircle className="h-3.5 w-3.5" /> },
} as const;

function tone(option: ReviewOption) {
    if (option.is_correct) return "bg-medical-green-50/70 border-medical-green-300";
    if (option.is_selected) return "bg-rose-50/70 border-rose-300";
    return "bg-ink-50/60 border-ink-100";
}

function OptionRow({ option, letter }: { option: ReviewOption; letter: string }) {
    return (
        <div className={`rounded-xl border px-4 py-3 ${tone(option)}`}>
            <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0">
                    {option.is_correct ? (
                        <CheckCircle2 className="h-4 w-4 text-medical-green-600" aria-label="Correct answer" />
                    ) : option.is_selected ? (
                        <XCircle className="h-4 w-4 text-rose-600" aria-label="Your answer" />
                    ) : (
                        <span className="block h-4 w-4 rounded-full border border-ink-200" />
                    )}
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink-800">
                        <span className="mr-2 text-xs font-bold text-ink-500">{letter}.</span>
                        <span className={option.is_correct || option.is_selected ? "font-semibold" : ""}>{option.option_text}</span>
                        {option.is_correct && option.is_selected && <span className="ml-2 text-[11px] font-bold text-medical-green-700">Your answer · Correct</span>}
                        {option.is_correct && !option.is_selected && <span className="ml-2 text-[11px] font-bold text-medical-green-700">Correct answer</span>}
                        {!option.is_correct && option.is_selected && <span className="ml-2 text-[11px] font-bold text-rose-700">Your answer</span>}
                    </p>
                    {option.explanation && <p className="mt-1.5 whitespace-pre-line text-xs leading-relaxed text-ink-600">{option.explanation}</p>}
                </div>
            </div>
        </div>
    );
}

function QuestionCard({ question, defaultOpen }: { question: ReviewQuestion; defaultOpen: boolean }) {
    const [open, setOpen] = useState(defaultOpen);
    const status = STATUS[question.status];
    return (
        <article className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-ink-50/70"
            >
                <span className="mt-0.5 shrink-0 text-xs font-extrabold text-ink-400">Q{question.question_order}</span>
                <span className={`min-w-0 flex-1 text-sm font-semibold text-ink-900 ${open ? "" : "line-clamp-2"}`}>{question.question_text}</span>
                <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold ${status.badge}`}>
                    {status.icon}
                    {status.label}
                </span>
                <ChevronDown className={`mt-0.5 h-4 w-4 shrink-0 text-ink-400 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            {open && (
                <div className="space-y-3 border-t border-ink-100 px-5 pb-5 pt-4">
                    <div className="space-y-2">
                        {question.options.map((option, idx) => (
                            <OptionRow key={option.option_id} option={option} letter={String.fromCharCode(65 + idx)} />
                        ))}
                    </div>
                    {question.status === "unanswered" && <p className="text-xs text-amber-700">You skipped this question. The correct answer is marked above.</p>}
                    <div className="rounded-xl border border-medical-blue-200 bg-medical-blue-50/70 px-4 py-3">
                        <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-medical-blue-700">
                            <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" /> Key learning point
                        </p>
                        {question.explanation ? (
                            <p className="whitespace-pre-line text-sm leading-relaxed text-ink-700">{question.explanation}</p>
                        ) : (
                            <p className="text-xs italic text-ink-500">No explanation has been added for this question yet.</p>
                        )}
                    </div>
                </div>
            )}
        </article>
    );
}

/** Every question with the correct answer and explanations; incorrect and skipped ones open first */
export function ExamReview({ review }: { review: ExamReviewData }) {
    const { summary } = review;
    const [filter, setFilter] = useState<Filter>(summary.incorrect + summary.unanswered > 0 ? "incorrect" : "all");
    const tabs: { value: Filter; label: string; count: number }[] = [
        { value: "all", label: "All", count: summary.total },
        { value: "incorrect", label: "Incorrect", count: summary.incorrect },
        { value: "correct", label: "Correct", count: summary.correct },
        { value: "unanswered", label: "Not answered", count: summary.unanswered },
    ];
    const visible = useMemo(() => (filter === "all" ? review.questions : review.questions.filter((q) => q.status === filter)), [review.questions, filter]);

    return (
        <section aria-labelledby="exam-review-heading" className="space-y-4">
            <div>
                <h2 id="exam-review-heading" className="font-display text-xl font-extrabold text-ink-900">
                    Review your answers
                </h2>
                <p className="mt-0.5 text-sm text-ink-500">See the correct answer and why each option is right or wrong.</p>
            </div>
            <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter questions">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        type="button"
                        role="tab"
                        aria-selected={filter === tab.value}
                        onClick={() => setFilter(tab.value)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                            filter === tab.value ? "border-medical-green-600 bg-medical-green-600 text-white" : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50"
                        }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>
            {visible.length === 0 ? (
                <div className="rounded-2xl border border-ink-100 bg-white p-8 text-center text-sm text-ink-500">No questions in this group.</div>
            ) : (
                <div className="space-y-3">
                    {visible.map((q) => (
                        <QuestionCard key={`${filter}-${q.question_id}`} question={q} defaultOpen={q.status !== "correct"} />
                    ))}
                </div>
            )}
        </section>
    );
}

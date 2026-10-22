import Link from "next/link";
import { ClipboardList, Play, RotateCcw, Trophy } from "lucide-react";
import { PassCountdown } from "@/components/PassCountdown";
import { formatSessionDate, formatSessionTime, type ExamInfo } from "@/lib/eventPass";

/** The online exam on a guest's session page: when it opens, a button to start or resume, or the score */
export function ExamCard({ token, exam }: { token: string; exam: ExamInfo }) {
    const href = `/join/${token}/exam`;
    const { sitting } = exam;

    let body: React.ReactNode;
    if (sitting?.status === "SUBMITTED") {
        body = (
            <>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-ink-900">
                    {sitting.passed === null ? "You’ve handed in your exam" : sitting.passed ? "You passed" : "You’ve handed in your exam"}
                </h2>
                <p className="mt-2 leading-relaxed text-ink-600">
                    Your score: <strong>{sitting.score} / {sitting.totalMarks}</strong> ({sitting.percentage}%).
                    {sitting.passed === false && exam.passMarkPercent !== null ? ` The pass mark was ${exam.passMarkPercent}%.` : ""}
                </p>
                <Link href={href} className="btn-secondary mt-5">
                    <Trophy className="h-4 w-4" aria-hidden="true" />
                    View my result{exam.showAnswersAfter ? " and review" : ""}
                </Link>
            </>
        );
    } else if (sitting?.status === "IN_PROGRESS") {
        body = (
            <>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-ink-900">Your exam is in progress</h2>
                <p className="mt-2 leading-relaxed text-ink-600">
                    The timer is running. Your answers so far are saved, so you can carry on where you left off.
                </p>
                <Link href={href} className="btn-primary mt-5 !px-8 !py-3.5 text-base">
                    <RotateCcw className="h-5 w-5" aria-hidden="true" />
                    Resume the exam
                </Link>
            </>
        );
    } else if (exam.phase === "OPEN") {
        body = (
            <>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-ink-900">The exam is open</h2>
                <p className="mt-2 leading-relaxed text-ink-600">
                    {exam.totalQuestions} questions
                    {exam.durationMins ? `, ${exam.durationMins} minutes` : ""}
                    {exam.passMarkPercent !== null ? `, pass mark ${exam.passMarkPercent}%` : ""}. The timer starts when you press Start.
                </p>
                <Link href={href} className="btn-primary mt-5 !px-8 !py-3.5 text-base">
                    <Play className="h-5 w-5" aria-hidden="true" />
                    Start the exam
                </Link>
            </>
        );
    } else if (exam.phase === "NOT_OPEN") {
        body = (
            <>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-ink-900">
                    Opens at {formatSessionTime(exam.startsAt)} on {formatSessionDate(exam.startsAt)}
                </h2>
                <p className="mt-2 leading-relaxed text-ink-600">
                    Come back to this page then and press Start. {exam.totalQuestions} questions
                    {exam.durationMins ? `, ${exam.durationMins} minutes` : ""}.
                </p>
                <div className="mt-4">
                    <PassCountdown opensAt={exam.startsAt} label="The exam opens in" />
                </div>
            </>
        );
    } else {
        body = (
            <>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-ink-900">This exam has closed</h2>
                <p className="mt-2 leading-relaxed text-ink-600">The time for the exam is over, so it can no longer be started.</p>
            </>
        );
    }

    return (
        <div className="rounded-2xl border border-medical-blue-200 bg-medical-blue-50/60 p-7">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-medical-blue-800">
                <ClipboardList className="h-4 w-4" aria-hidden="true" />
                Your online exam
            </p>
            {body}
        </div>
    );
}

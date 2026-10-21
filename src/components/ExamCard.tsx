import Link from "next/link";
import { Calendar, Clock, ArrowRight, MapPin, Users } from "lucide-react";
import { MockExam, formatExamDate, formatExamTime, formatFee } from "@/lib/mockExams";
import { posterSrc } from "@/lib/mockExams.server";

interface ExamCardProps {
  exam: MockExam;
}

export function ExamCard({ exam }: ExamCardProps) {
  const poster = posterSrc(exam);
  const full = exam.availableSlots === 0;
  const fewLeft = !full && exam.availableSlots <= Math.max(3, Math.ceil(exam.totalSlots * 0.2));
  const filledPct = exam.totalSlots > 0 ? Math.min((exam.bookedSlots / exam.totalSlots) * 100, 100) : 0;

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-medical-blue-50 text-medical-blue-700">
          Mock Exam
        </span>
        {full ? (
          <span className="text-xs font-bold text-ink-600 bg-ink-50 px-2.5 py-1 rounded-md border border-ink-200">
            FULLY BOOKED
          </span>
        ) : fewLeft ? (
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
            ONLY {exam.availableSlots} {exam.availableSlots === 1 ? "SLOT" : "SLOTS"} LEFT!
          </span>
        ) : (
          <span className="text-xs font-bold text-medical-green-800 bg-medical-green-50 px-2.5 py-1 rounded-md border border-medical-green-200">
            SLOTS OPEN
          </span>
        )}
      </div>

      {poster && (
        <div className="relative w-full h-48 md:h-52 overflow-hidden rounded-xl mb-4 ring-1 ring-ink-100">
          {/* The poster is served by the LMS backend through a signed redirect */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt={exam.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <h3 className="font-display text-xl font-extrabold text-ink-900 mb-2 leading-snug">{exam.title}</h3>
      {exam.description && <p className="text-ink-600 text-sm mb-5 flex-grow line-clamp-3">{exam.description}</p>}

      <div className="space-y-2.5 mb-6 text-sm text-ink-600 border-t border-ink-100 pt-4 mt-auto">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2.5 text-medical-green-600 shrink-0" />
          <span>{formatExamDate(exam.examDate)}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2.5 text-medical-green-600 shrink-0" />
          <span>{formatExamTime(exam.examDate)} onwards</span>
        </div>
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2.5 text-medical-green-600 shrink-0" />
          <span>{exam.venue}</span>
        </div>

        <div className="pt-1">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 font-medium text-ink-700">
              <Users className="h-3.5 w-3.5 text-medical-green-600" />
              {exam.availableSlots} of {exam.totalSlots} slots available
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden">
            <div
              className={`h-full rounded-full ${full ? "bg-ink-300" : fewLeft ? "bg-rose-500" : "bg-medical-green-600"}`}
              style={{ width: `${filledPct}%` }}
            />
          </div>
        </div>

        <div className="pt-2">
          <span className="text-xs text-ink-500 uppercase font-semibold tracking-wider block">Exam Fee</span>
          <span className="font-display text-2xl font-extrabold text-medical-green-700">{formatFee(exam.price, exam.currencyCode)}</span>
          {exam.price > 0 && <span className="text-xs text-ink-500"> per slot</span>}
        </div>
      </div>

      {exam.isBookable ? (
        <Link
          href={`/exams/${exam.mockExamId}/register`}
          className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-medical-green-600 text-white font-semibold hover:bg-medical-green-700 transition-all shadow-sm hover:shadow gap-2 group/btn"
        >
          <span>Book Your Slot</span>
          <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-ink-100 text-ink-500 font-semibold cursor-not-allowed"
        >
          {full ? "Fully Booked" : "Bookings Closed"}
        </button>
      )}
    </article>
  );
}

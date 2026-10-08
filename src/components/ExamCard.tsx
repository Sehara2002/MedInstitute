"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  ArrowRight,
  MapPin,
  Lock,
  Unlock,
  Award,
  BookOpen,
  CheckCircle,
  X,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Exam } from "@/data/exams";

interface ExamCardProps {
  exam: Exam;
}

export function ExamCard({ exam }: ExamCardProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const isLocked = exam.isLocked ?? true;

  const registerUrl = `/register?id=${encodeURIComponent(exam.id)}&title=${encodeURIComponent(
    exam.title
  )}&amount=${encodeURIComponent(String(exam.rawPrice ?? exam.fee ?? ""))}`;

  const handleProceedToPayment = () => {
    setShowModal(false);
    router.push(registerUrl);
  };

  return (
    <>
      <GlassCard className="flex flex-col h-full p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] relative group border border-white/50">
        {/* Top Badges / Lock Indicator */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                exam.type === "Mock Exam"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {exam.type}
            </span>

            {exam.isAdminCreated && (
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                Official Exam
              </span>
            )}
          </div>

          {/* Clickable Lock / Unlock Badge */}
          {isLocked ? (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/90 hover:bg-amber-100 hover:border-amber-300 transition-all cursor-pointer shadow-xs group/lock"
              title="This exam is locked. Click to register and pay to unlock."
            >
              <Lock className="h-3.5 w-3.5 text-amber-600 transition-transform group-hover/lock:scale-110" />
              <span>Locked</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Unlock className="h-3.5 w-3.5 text-emerald-600" />
              <span>Unlocked</span>
            </span>
          )}
        </div>

        {/* Media or Placeholder Banner */}
        {exam.image ? (
          <div className="relative w-full h-48 md:h-52 overflow-hidden rounded-xl mb-4 shadow-xs">
            <Image
              src={exam.image}
              alt={exam.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {isLocked && (
              <div
                onClick={() => setShowModal(true)}
                className="absolute inset-0 bg-black/25 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-gray-900 shadow-lg">
                  <Lock className="h-3.5 w-3.5 text-amber-600" /> Click to Unlock
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => isLocked && setShowModal(true)}
            className={`w-full h-32 rounded-xl mb-4 flex flex-col items-center justify-center p-4 text-center border relative overflow-hidden transition-colors ${
              isLocked
                ? "bg-gradient-to-br from-amber-50/50 via-gray-50 to-emerald-50/30 border-amber-200/40 cursor-pointer"
                : "bg-gradient-to-br from-emerald-50/60 to-gray-50 border-emerald-200/40"
            }`}
          >
            {isLocked ? (
              <>
                <div className="w-10 h-10 rounded-full bg-amber-100/80 flex items-center justify-center mb-2 text-amber-700 shadow-xs">
                  <Lock className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-gray-700">
                  {exam.courseName ? `${exam.courseName}` : "Timed Simulation Exam"}
                </span>
                <span className="text-[11px] text-gray-500">
                  {exam.batchName ? `Batch: ${exam.batchName}` : "Click to view unlock requirements"}
                </span>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-emerald-100/80 flex items-center justify-center mb-2 text-emerald-700 shadow-xs">
                  <Unlock className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-emerald-800">
                  {exam.courseName ? `${exam.courseName}` : "Ready to Take"}
                </span>
              </>
            )}
          </div>
        )}

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug">{exam.title}</h3>

        {exam.courseName && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-medical-green-700 mb-2">
            <BookOpen className="h-3.5 w-3.5" />
            <span>
              {exam.courseName}
              {exam.batchName ? ` • ${exam.batchName}` : ""}
            </span>
          </div>
        )}

        <p className="text-gray-600 text-sm mb-5 flex-grow line-clamp-3">{exam.description}</p>

        {/* Meta Details */}
        <div className="space-y-2.5 mb-6 text-sm text-gray-600 border-t border-gray-100 pt-4">
          {exam.date && (
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2.5 text-medical-green-600 shrink-0" />
              <span>{exam.date}</span>
            </div>
          )}

          {exam.time && (
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2.5 text-medical-blue-600 shrink-0" />
              <span>{exam.time}</span>
            </div>
          )}

          {exam.durationMins && (
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2.5 text-purple-600 shrink-0" />
              <span>Duration: {exam.durationMins} minutes</span>
            </div>
          )}

          {exam.totalMarks !== undefined && (
            <div className="flex items-center text-gray-600">
              <Award className="h-4 w-4 mr-2.5 text-amber-600 shrink-0" />
              <span>
                Total Marks: {exam.totalMarks}
                {exam.passMarks ? ` (Pass: ${exam.passMarks})` : ""}
              </span>
            </div>
          )}

          {exam.loc && (
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2.5 text-gray-400 shrink-0" />
              <span>{exam.loc}</span>
            </div>
          )}

          <div className="pt-2 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider block">
                Exam Fee
              </span>
              <span className="text-xl font-bold text-medical-green-700">{exam.fee}</span>
            </div>
            {exam.offer && (
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-200">
                {exam.offer}
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        {isLocked ? (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-medical-green-600 text-white font-semibold hover:bg-medical-green-700 transition-all shadow-sm hover:shadow gap-2 cursor-pointer group/btn"
          >
            <Lock className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
            <span>Unlock & Register</span>
            <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </button>
        ) : (
          <Link
            href="/dashboard"
            className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-sm gap-2"
          >
            <Unlock className="h-4 w-4" />
            <span>Access Mock Exam</span>
            <ArrowRight className="ml-auto h-4 w-4" />
          </Link>
        )}
      </GlassCard>

      {/* Unlock & Register Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-medical-green-700 to-medical-green-600 text-white p-6 relative">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Unlock Mock Exam</h3>
                  <p className="text-white/80 text-xs">Registration & Payment Required</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-lg font-bold text-gray-900">{exam.title}</h4>
                {exam.courseName && (
                  <p className="text-sm text-medical-green-700 font-medium mt-0.5">
                    {exam.courseName}
                    {exam.batchName ? ` • ${exam.batchName}` : ""}
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-2">{exam.description}</p>
              </div>

              {/* Highlights summary */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2 text-sm text-gray-700">
                {exam.date && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-medical-green-600" /> Date
                    </span>
                    <span className="font-semibold text-gray-900">{exam.date}</span>
                  </div>
                )}
                {exam.durationMins && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-medical-blue-600" /> Duration
                    </span>
                    <span className="font-semibold text-gray-900">{exam.durationMins} minutes</span>
                  </div>
                )}
                {exam.totalMarks !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-600" /> Total Marks
                    </span>
                    <span className="font-semibold text-gray-900">
                      {exam.totalMarks} {exam.passMarks ? `(Pass: ${exam.passMarks})` : ""}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-700 font-bold flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-medical-green-600" /> Total Amount
                  </span>
                  <span className="text-lg font-extrabold text-medical-green-700">{exam.fee}</span>
                </div>
              </div>

              <div className="rounded-lg bg-amber-50 border border-amber-200/80 p-3 flex gap-2.5 text-xs text-amber-800">
                <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  To unlock your official seat, please complete the registration form and finish
                  your payment. Your mock exam access will be unlocked automatically.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 bg-gray-50/80 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-200/80 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProceedToPayment}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-medical-green-600 text-white font-semibold hover:bg-medical-green-700 transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Proceed to Register & Pay</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { formatExamDate, formatExamTime, formatFee, MockExamBooking, verifyBooking } from "@/lib/mockExams";

/** Where the payment gateway sends the candidate back after paying */
function ResultContent() {
  const reference = useSearchParams().get("ref");
  const [booking, setBooking] = useState<MockExamBooking | null>(null);
  const [error, setError] = useState<string | null>(reference ? null : "Missing booking reference.");

  useEffect(() => {
    if (!reference) return;
    verifyBooking(reference).then(setBooking, (err: Error) => setError(err.message));
  }, [reference]);

  return (
    <GlassCard className="p-8 text-center">
      {!booking && !error && <p>Verifying your payment...</p>}

      {error && (
        <p className="text-red-700">
          {error} If you were charged, please contact support with your booking reference{reference ? ` (${reference.slice(0, 8)})` : ""}.
        </p>
      )}

      {booking?.status === "PAID" && (
        <>
          <h1 className="text-2xl font-bold text-green-700 mb-2">Booking Confirmed</h1>
          <p className="text-gray-600 mb-6">
            Your seat for <strong>{booking.exam?.title}</strong> is confirmed. A confirmation has been emailed to{" "}
            <strong>{booking.email}</strong>.
          </p>
          <div className="text-left rounded-xl bg-emerald-50 border border-emerald-200 p-5 space-y-2 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Slot number</span>
              <span className="text-xl font-extrabold text-medical-green-700">#{booking.slotNumber}</span>
            </div>
            {booking.exam && (
              <>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold text-right">
                    {formatExamDate(booking.exam.examDate)}, {formatExamTime(booking.exam.examDate)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Venue</span>
                  <span className="font-semibold text-right">{booking.exam.venue}</span>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Amount paid</span>
              <span className="font-semibold">{formatFee(booking.amount, booking.currencyCode)}</span>
            </div>
          </div>
          <Link href="/exams" className="glass-btn inline-block px-4 py-2 rounded-md">
            Back to Mock Exams
          </Link>
        </>
      )}

      {booking && booking.status !== "PAID" && (
        <>
          <h1 className="text-2xl font-bold text-red-700 mb-2">Payment Not Completed</h1>
          <p className="text-gray-600 mb-4">
            We couldn&apos;t confirm your payment. No charge may have been made.
          </p>
          <Link href={`/exams/booking?ref=${booking.reference}`} className="glass-btn inline-block px-4 py-2 rounded-md">
            Try Again
          </Link>
        </>
      )}
    </GlassCard>
  );
}

export default function BookingResultPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-xl">
          <Suspense fallback={<p className="text-center">Loading...</p>}>
            <ResultContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}

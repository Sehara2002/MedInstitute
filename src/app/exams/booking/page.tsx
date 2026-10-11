"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { formatExamDate, formatExamTime, formatFee, getBooking, MockExamBooking, payForBooking } from "@/lib/mockExams";

/** Review the booking and go to the bank's payment page */
function BookingSummary() {
  const reference = useSearchParams().get("ref");
  const [booking, setBooking] = useState<MockExamBooking | null>(null);
  const [error, setError] = useState<string | null>(reference ? null : "Missing booking reference.");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!reference) return;
    getBooking(reference).then(setBooking, (err: Error) => setError(err.message));
  }, [reference]);

  async function handlePay() {
    if (!booking) return;
    setPaying(true);
    try {
      await payForBooking(booking.reference);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Payment could not be started.");
      setPaying(false);
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <h1 className="text-3xl font-extrabold mb-4">Booking Summary</h1>
      <p className="text-gray-600 mb-6">
        Review your details below and proceed to payment. Your seat is reserved once payment is received. We have also
        emailed you a link to this page, so you can come back and pay later.
      </p>

      <GlassCard className="p-8 max-w-xl w-full mx-auto">
        {!booking && !error && <p>Loading...</p>}
        {error && <p className="text-red-700">{error}</p>}

        {booking && booking.status === "PAID" && (
          <div className="text-center space-y-4">
            <p className="text-gray-700">This booking is already paid. Your slot number is <strong>#{booking.slotNumber}</strong>.</p>
            <Link href={`/exams/booking/result?ref=${booking.reference}`} className="glass-btn inline-block px-4 py-2 rounded-md">
              View confirmation
            </Link>
          </div>
        )}

        {booking && booking.status !== "PAID" && (
          <div className="space-y-4">
            <div className="text-sm text-gray-700"><span className="font-medium">Name:</span> {booking.firstName} {booking.lastName}</div>
            <div className="text-sm text-gray-700"><span className="font-medium">Email:</span> {booking.email}</div>
            <div className="text-sm text-gray-700"><span className="font-medium">Phone:</span> {booking.phone}</div>
            <div className="text-sm text-gray-700"><span className="font-medium">Exam:</span> {booking.exam?.title}</div>
            {booking.exam && (
              <>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Date:</span> {formatExamDate(booking.exam.examDate)}, {formatExamTime(booking.exam.examDate)}
                </div>
                <div className="text-sm text-gray-700"><span className="font-medium">Venue:</span> {booking.exam.venue}</div>
              </>
            )}
            <div className="text-sm text-gray-700"><span className="font-medium">Amount:</span> {formatFee(booking.amount, booking.currencyCode)}</div>

            {booking.status === "FAILED" && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">
                Your previous payment attempt was not successful. You can try again below.
              </p>
            )}

            {booking.exam && !booking.exam.isBookable ? (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">
                Sorry, this mock exam is no longer taking bookings{booking.exam.availableSlots === 0 ? " (fully booked)" : ""}.
              </p>
            ) : (
              <div className="mt-6">
                <button
                  onClick={handlePay}
                  disabled={paying}
                  className="w-full inline-block text-center glass-btn px-4 py-3 rounded-md disabled:opacity-50"
                >
                  {paying ? "Redirecting to payment..." : "Proceed to Payment"}
                </button>
              </div>
            )}

            <div className="flex items-center justify-center gap-4 pt-6 mt-6 border-t border-gray-200">
              <span className="text-xs text-gray-500 font-medium">We&apos;re powered with</span>
              <Image src="/images/combanklogo2.png" alt="Commercial Bank" width={150} height={24} className="object-contain" />
              <Image src="/images/visalogo.png" alt="Visa" width={80} height={24} className="object-contain" />
              <Image src="/images/mastercardlogo.png" alt="Mastercard" width={80} height={24} className="object-contain" />
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

export default function BookingSummaryPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        <Suspense fallback={<p className="p-8">Loading...</p>}>
          <BookingSummary />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";

function ResultContent() {
  const params = useSearchParams();
  const regId = params.get("regId");
  const [status, setStatus] = useState<"checking" | "paid" | "failed" | "error">("checking");
  const [registration, setRegistration] = useState<any>(null);

  useEffect(() => {
    if (!regId) {
      setStatus("error");
      return;
    }
    fetch(`/api/payment/verify?regId=${regId}`)
      .then((r) => r.json())
      .then((d) => {
        setRegistration(d.registration);
        setStatus(d.isPaid ? "paid" : "failed");
      })
      .catch(() => setStatus("error"));
  }, [regId]);

  return (
    <GlassCard className="p-8 text-center">
      {status === "checking" && <p>Verifying your payment...</p>}

      {status === "paid" && (
        <>
          <h1 className="text-2xl font-bold text-green-700 mb-2">Payment Successful</h1>
          <p className="text-gray-600 mb-4">
            Your registration for <strong>{registration?.course}</strong> is confirmed.
          </p>
          <Link href="/" className="glass-btn inline-block px-4 py-2 rounded-md">
            Back to Home
          </Link>
        </>
      )}

      {status === "failed" && (
        <>
          <h1 className="text-2xl font-bold text-red-700 mb-2">Payment Not Completed</h1>
          <p className="text-gray-600 mb-4">
            We couldn't confirm your payment. No charge may have been made.
          </p>
          <Link href={`/register/summary?id=${regId}`} className="glass-btn inline-block px-4 py-2 rounded-md">
            Try Again
          </Link>
        </>
      )}

      {status === "error" && (
        <p className="text-red-700">
          Something went wrong verifying your payment. Please contact support with your registration ID.
        </p>
      )}
    </GlassCard>
  );
}

export default function ResultPage() {
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
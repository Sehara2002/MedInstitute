"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { CheckCircle2, AlertTriangle, ArrowRight, Home, Sparkles, BookOpen, ShieldCheck, Mail } from "lucide-react";

function ResultContent() {
  const params = useSearchParams();
  const regId = params.get("regId");
  const [status, setStatus] = useState<"checking" | "paid" | "failed" | "error">("checking");
  const [registration, setRegistration] = useState<any>(null);
  const [isTestMode, setIsTestMode] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);

  useEffect(() => {
    if (!regId) {
      setStatus("error");
      return;
    }
    fetch(`/api/payment/verify?regId=${regId}`)
      .then((r) => r.json())
      .then((d) => {
        setRegistration(d.registration);
        setIsTestMode(!!d.testMode || d.registration?.orderId?.startsWith("TEST-"));
        setAlreadyExists(Boolean(d.alreadyExists));
        setStatus(d.isPaid ? "paid" : "failed");
      })
      .catch(() => setStatus("error"));
  }, [regId]);

  return (
    <GlassCard className="p-8 sm:p-10 text-center rounded-2xl shadow-xl border border-slate-200/80 bg-white/95 backdrop-blur-md">
      {status === "checking" && (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-700">Confirming registration & enrollment status...</p>
        </div>
      )}

      {status === "paid" && (
        <div className="space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm ring-8 ring-emerald-50">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/70 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Enrollment Confirmed {isTestMode ? "(Testing Mode)" : ""}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Registration Successful!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
              Your enrollment for <strong className="text-slate-900">{registration?.course}</strong> has been registered and synced with the central LMS database.
            </p>
          </div>

          {registration && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-left space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Candidate:</span>
                  <span className="font-bold text-slate-900">{registration.firstName} {registration.lastName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-bold text-slate-900">{registration.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-emerald-700 uppercase tracking-wider">Active / Confirmed</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Reference:</span>
                  <span className="font-mono font-medium text-slate-600">{registration.orderId || registration.id}</span>
                </div>
              </div>

              {alreadyExists ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-left space-y-1.5 text-xs text-amber-950">
                  <div className="flex items-center gap-2 font-bold text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Account Already Exists</span>
                  </div>
                  <p className="text-[11px] text-amber-800/90 leading-relaxed">
                    An account with <strong>{registration.email}</strong> is already registered in the MRCGP LMS. No new credentials email was dispatched. Please use your existing portal password to sign in.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-left space-y-1.5 text-xs text-emerald-950">
                  <div className="flex items-center gap-2 font-bold text-emerald-800">
                    <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Portal Credentials Sent via Email</span>
                  </div>
                  <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                    Your sign-in username, temporary access password, and portal activation link have been sent directly to <strong>{registration.email}</strong>. For your security, credentials are not displayed on screen. Please check your inbox to sign in to the student portal and set your permanent password.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <a
              href={`${process.env.NEXT_PUBLIC_LMS_FRONTEND_URL || "http://localhost:3000"}/login`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Go to LMS Portal</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {status === "failed" && (
        <div className="space-y-5">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-sm ring-8 ring-rose-50">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Payment Not Completed</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              We couldn't confirm your transaction. No charge was made to your card.
            </p>
          </div>

          <Link
            href={`/register/summary?id=${regId}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer"
          >
            <span>Return to Order Summary</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-4">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Verification Pending</h2>
          <p className="text-xs text-slate-600">
            Could not retrieve registration information. Please check your registration ID or contact support.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
          >
            Return to Home
          </Link>
        </div>
      )}
    </GlassCard>
  );
}

export default function ResultPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center py-12 px-4 bg-slate-50/60">
        <div className="w-full max-w-xl">
          <Suspense fallback={<p className="text-center text-slate-500">Loading result...</p>}>
            <ResultContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
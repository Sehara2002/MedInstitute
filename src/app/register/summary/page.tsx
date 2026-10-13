"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import Image from "next/image";
import { Sparkles, CheckCircle2, CreditCard, ShieldCheck, ArrowRight, User, Mail, Phone, BookOpen, AlertCircle } from "lucide-react";

function SummaryContent() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const [reg, setReg] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [simulating, setSimulating] = useState(false);
  /** Set when the price was re-checked before payment and had changed (e.g. the offer ended) */
  const [priceNotice, setPriceNotice] = useState<{ message: string; previousAmount: number } | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/registration?id=${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.registration?.status === "paid") {
          router.replace(`/register/summary/result?regId=${id}`);
          return;
        }
        setReg(d?.registration);
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  // Simulated Test Mode Payment (Bypasses card gateway, marks student as paid and enlists them)
  async function handleTestPay() {
    if (!reg) return;
    setSimulating(true);
    try {
      const res = await fetch(`/api/payment/verify?regId=${reg.id}&testMode=true`);
      const data = await res.json();
      if (res.ok && data?.isPaid) {
        router.push(`/register/summary/result?regId=${reg.id}`);
      } else {
        alert(data?.error || "Could not complete simulated payment.");
        setSimulating(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to simulate test payment.");
      setSimulating(false);
    }
  }

  // Real MPGS Payment Gateway Integration (Preserved for live launch)
  async function handlePay() {
    if (!reg) return;
    setPaying(true);
    try {
      const res = await fetch("/api/payment/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: reg.id }),
      });
      const data = await res.json();

      console.log("[create-session] response:", data);

      // The price changed since registering: show the new amount and let the student continue
      if (res.status === 409 && data?.priceChanged && data?.registration) {
        setReg(data.registration);
        setPriceNotice({ message: data.error, previousAmount: data.previousAmount });
        setPaying(false);
        return;
      }

      if (!data?.session?.id) {
        alert(data?.error || "Could not start payment. Please try again.");
        setPaying(false);
        return;
      }

      // @ts-ignore
      Checkout.configure({
        session: { id: data.session.id },
        version: "100",
      });
      // @ts-ignore
      Checkout.showPaymentPage();
    } catch (err) {
      console.error(err);
      alert("Payment could not be started.");
      setPaying(false);
    }
  }

  if (!id) return <p className="p-8 text-center text-slate-500">Missing registration id.</p>;

  return (
    <>
      <Script
        src={`${process.env.NEXT_PUBLIC_MPGS_GATEWAY_URL}/static/checkout/checkout.min.js`}
        data-error="errorCallback"
        data-cancel={`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"}/register/summary?id=${id}`}
      />
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Order & Registration Summary
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Review your candidate details and finalize your enrollment
          </p>
        </div>

        <GlassCard className="p-6 sm:p-8 w-full shadow-lg border border-slate-200/80 rounded-2xl bg-white/95 backdrop-blur-md">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-500 font-medium">Loading registration details...</p>
            </div>
          )}

          {reg && (
            <div className="space-y-6">
              {/* Registration Data Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Candidate Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Candidate:</span>
                      <span className="font-semibold text-slate-900">{reg.firstName} {reg.lastName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Email:</span>
                      <span className="font-semibold text-slate-900">{reg.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Phone:</span>
                      <span className="font-semibold text-slate-900">{reg.phone || "Not specified"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Program:</span>
                      <span className="font-semibold text-slate-900">{reg.course}</span>
                    </div>
                  </div>
                </div>
              </div>

              {priceNotice && (
                <div
                  role="alert"
                  className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900"
                >
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">{priceNotice.message}</span>
                    <span className="text-amber-800">
                      Previous amount: LKR {priceNotice.previousAmount.toLocaleString()} · New amount: LKR{" "}
                      {Number(reg.amount).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Total Payable Card */}
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Tuition Payable</span>
                  <span className="text-[11px] text-slate-500">Processed in Sri Lankan Rupees</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-700">
                  {typeof reg.amount === "number" ? `LKR ${reg.amount.toLocaleString()}` : reg.amount}
                </div>
              </div>

              {/* Primary Action: Live Card Payment */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={paying || simulating}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {paying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Redirecting to Payment Gateway...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Security & Partner Logos */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Commercial Bank MPGS Security Partner</span>
                </div>
                <div className="flex items-center gap-3">
                  <Image src="/images/combanklogo2.png" alt="Commercial Bank" width={110} height={18} className="object-contain" />
                  <Image src="/images/visalogo.png" alt="Visa" width={50} height={16} className="object-contain" />
                  <Image src="/images/mastercardlogo.png" alt="Mastercard" width={50} height={16} className="object-contain" />
                </div>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </>
  );
}

export default function SummaryPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center py-12 px-4 bg-slate-50/60">
        <Suspense fallback={<p className="p-8 text-center text-slate-500">Loading summary...</p>}>
          <SummaryContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
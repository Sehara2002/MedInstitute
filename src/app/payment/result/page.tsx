"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";

declare global {
  interface Window {
    Checkout: any;
  }
}

export default function SummaryPage() {
  const params = useSearchParams();
  const id = params.get("id");

  const [reg, setReg] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [mpgsReady, setMpgsReady] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`/api/registration?id=${id}`)
      .then((r) => r.json())
      .then((d) => setReg(d.registration))
      .finally(() => setLoading(false));
  }, [id]);

  async function handlePay() {
    if (!reg || !mpgsReady) return;

    setPaying(true);

    try {
      const res = await fetch("/api/mpgs/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: reg.id,
          amount: reg.amount,
        }),
      });

      const data = await res.json();

      console.log("[MPGS session response]", data);

      // IMPORTANT: backend must return sessionId
      const sessionId = data.sessionId || data?.session?.id;

      if (!sessionId) {
        alert(data?.error || "Payment session failed");
        setPaying(false);
        return;
      }

      window.Checkout.configure({
        session: {
          id: sessionId,
        },
      });

      window.Checkout.showPaymentPage();
    } catch (err) {
      console.error(err);
      alert("Payment could not be started");
      setPaying(false);
    }
  }

  if (!id) return <p className="p-8">Missing registration id.</p>;

  return (
    <>
      {/* MPGS SCRIPT (SAFE LOADING) */}
      <Script
        src="https://ap-gateway.mastercard.com/static/checkout/checkout.min.js"
        strategy="afterInteractive"
        onLoad={() => setMpgsReady(true)}
      />

      <Navbar />

      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-3xl">

          <h1 className="text-3xl font-extrabold mb-4">
            Registration Summary
          </h1>

          <p className="text-gray-600 mb-6">
            Review your details below and proceed to payment.
          </p>

          <GlassCard className="p-8 max-w-xl w-full mx-auto">

            {loading && <p>Loading...</p>}

            {reg && (
              <div className="space-y-4">

                <div><b>Name:</b> {reg.firstName} {reg.lastName}</div>
                <div><b>Email:</b> {reg.email}</div>
                <div><b>Phone:</b> {reg.phone}</div>
                <div><b>Course:</b> {reg.course}</div>
                <div>
                  <b>Amount:</b> {reg.amount} LKR
                </div>

                <button
                  onClick={handlePay}
                  disabled={paying || !mpgsReady}
                  className="w-full mt-6 glass-btn px-4 py-3 rounded-md disabled:opacity-50"
                >
                  {!mpgsReady
                    ? "Loading payment gateway..."
                    : paying
                    ? "Redirecting..."
                    : "Proceed to Payment"}
                </button>

              </div>
            )}

          </GlassCard>
        </div>
      </main>

      <Footer />
    </>
  );
}
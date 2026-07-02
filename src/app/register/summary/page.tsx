"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";

export default function SummaryPage() {
  const params = useSearchParams();
  const id = params.get("id");
  const [reg, setReg] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/registration?id=${id}`)
      .then((r) => r.json())
      .then((d) => setReg(d.registration))
      .finally(() => setLoading(false));
  }, [id]);

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

      if (!data?.session?.id) {
        alert(data?.error || "Could not start payment. Please try again.");
        setPaying(false);
        return;
      }

      // From API v67+, configure() only accepts { session: { id } } —
      // order/interaction/merchant details are already attached server-side via INITIATE_CHECKOUT


      console.log("[DEBUG] MPGS_GATEWAY_URL:", process.env.NEXT_PUBLIC_MPGS_GATEWAY_URL);
      console.log("[DEBUG] BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);

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

  if (!id) return <p className="p-8">Missing registration id.</p>;

  return (
    <>
      <Script
        src={`${process.env.NEXT_PUBLIC_MPGS_GATEWAY_URL}/static/checkout/checkout.min.js`}
        data-error="errorCallback"
        data-cancel={`${process.env.NEXT_PUBLIC_BASE_URL}/register/summary?id=${id}`}
      />
      <Navbar />
      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-extrabold mb-4">Registration Summary</h1>
          <p className="text-gray-600 mb-6">Review your details below and proceed to payment.</p>

          <GlassCard className="p-8 max-w-xl w-full mx-auto">
            {loading && <p>Loading...</p>}
            {reg && (
              <div className="space-y-4">
                <div className="text-sm text-gray-700"><span className="font-medium">Name:</span> {reg.firstName} {reg.lastName}</div>
                <div className="text-sm text-gray-700"><span className="font-medium">Email:</span> {reg.email}</div>
                <div className="text-sm text-gray-700"><span className="font-medium">Phone:</span> {reg.phone}</div>
                <div className="text-sm text-gray-700"><span className="font-medium">Course:</span> {reg.course}</div>
                <div className="text-sm text-gray-700"><span className="font-medium">Amount:</span> {reg.amount} {process.env.NEXT_PUBLIC_CURRENCY || "LKR"}</div>

                <div className="mt-6">
                  <button
                    onClick={handlePay}
                    disabled={paying}
                    className="w-full inline-block text-center glass-btn px-4 py-3 rounded-md disabled:opacity-50"
                  >
                    {paying ? "Redirecting to payment..." : "Proceed to Payment"}
                  </button>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </main>
      <Footer />
    </>
  );
}
"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GlassCard } from "@/components/GlassCard";
import { courses } from "@/data/courses";
import { exams } from "@/data/exams";
import { parsePriceToNumber } from "@/lib/price";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const idParam = params.get("id") || "";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [amountLabel, setAmountLabel] = useState<string>("");
  const [amountEditable, setAmountEditable] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mode-pricing state — only used when the course/exam has modePricing
  const [modeOptions, setModeOptions] = useState<{ mode: string; fee: string }[]>([]);
  const [selectedMode, setSelectedMode] = useState<string>("");

  useEffect(() => {
    const foundCourse = courses.find((c) => c.id === idParam);
    const foundExam = exams.find((e) => e.id === idParam);
    const found = foundCourse || foundExam;

    if (found) {
      setCourse(found.title);

      if ("modePricing" in found && found.modePricing && found.modePricing.length > 0) {
        setModeOptions(found.modePricing);
        // Default to the first mode so amount is never 0 on load
        const first = found.modePricing[0];
        setSelectedMode(first.mode);
        const p = parsePriceToNumber(first.fee);
        setAmount(p ?? 0);
        setAmountLabel(first.fee);
        setAmountEditable(p === null);
      } else {
        setModeOptions([]);
        setSelectedMode("");
        const p = parsePriceToNumber(found.fee);
        if (p !== null) {
          setAmount(p);
          setAmountLabel(String(p));
          setAmountEditable(false);
        } else {
          setAmount(0);
          setAmountLabel(found.fee || "On Request");
          setAmountEditable(true);
        }
      }
    }
  }, [idParam]);

  function handleModeSelect(mode: string, fee: string) {
    setSelectedMode(mode);
    const p = parsePriceToNumber(fee);
    setAmount(p ?? 0);
    setAmountLabel(fee);
    setAmountEditable(p === null);
  }

  const amountDisplay = useMemo(() => {
    return amount > 0 ? `${process.env.NEXT_PUBLIC_CURRENCY || "LKR"} ${amount}` : amountLabel || "0";
  }, [amount, amountLabel]);

  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [successId, setSuccessId] = useState<string | null>(null);

  function validate() {
    const e: { [k: string]: string } = {};
    if (!firstName.trim()) e.firstName = "First name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (amount <= 0) e.amount = "Amount should be greater than zero";
    if (modeOptions.length > 0 && !selectedMode) e.mode = "Please select a mode";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // Append the selected mode to the course label so it's captured in the registration record and emails
      const courseLabel = selectedMode ? `${course} (${selectedMode})` : course;

      const res = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, courseId: idParam, course: courseLabel, amount }),
      });
      const data = await res.json();
      setLoading(false);
      if (data?.registration?.id) {
        setSuccessId(data.registration.id);
        setTimeout(() => {
          router.push(`/register/summary?id=${data.registration.id}`);
        }, 800);
      } else {
        setErrors({ form: data?.error || "Failed to create registration" });
      }
    } catch (err) {
      setLoading(false);
      setErrors({ form: String(err) });
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900">Registration</h1>
      <p className="text-gray-600 mb-6">Complete the form below to register. We'll redirect you to the summary and payment.</p>

      <GlassCard className="p-8 max-w-xl w-full mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">First name</label>
            <input required placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white/60 focus:outline-none focus:ring-2 focus:ring-medical-green-200 focus:border-medical-green-500 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last name</label>
            <input placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white/60 focus:outline-none focus:ring-2 focus:ring-medical-green-200 focus:border-medical-green-500 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input required placeholder="name@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white/60 focus:outline-none focus:ring-2 focus:ring-medical-green-200 focus:border-medical-green-500 transition" />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input placeholder="(+94) 71 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white/60 focus:outline-none focus:ring-2 focus:ring-medical-green-200 focus:border-medical-green-500 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Course / Item</label>
            <input disabled={!!course} value={course} onChange={(e) => setCourse(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white/60 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-medical-green-200 focus:border-medical-green-500 transition" />
          </div>

          {/* Mode selection — only shown for courses with modePricing */}
          {modeOptions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Mode of Delivery</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {modeOptions.map((opt) => {
                  const isSelected = selectedMode === opt.mode;
                  return (
                    <button
                      key={opt.mode}
                      type="button"
                      onClick={() => handleModeSelect(opt.mode, opt.fee)}
                      className={`relative text-left p-4 rounded-xl border-2 transition-all ${isSelected
                          ? "border-medical-green-600 bg-medical-green-50 shadow-md ring-2 ring-medical-green-200"
                          : "border-gray-200 bg-white/60 hover:border-medical-green-300 hover:bg-white"
                        }`}
                    >
                      {isSelected && (
                        <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-medical-green-600" />
                      )}
                      <p className={`font-bold ${isSelected ? "text-medical-green-800" : "text-gray-900"}`}>
                        {opt.mode}
                      </p>
                      <p className={`text-lg font-extrabold mt-1 ${isSelected ? "text-medical-green-700" : "text-gray-700"}`}>
                        {opt.fee}
                      </p>
                    </button>
                  );
                })}
              </div>
              {errors.mode && <p className="text-sm text-red-600 mt-2">{errors.mode}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount ({process.env.NEXT_PUBLIC_CURRENCY || "LKR"})</label>
            <input
              type="number"
              value={amount}
              disabled={!amountEditable}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white/60 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-medical-green-200 focus:border-medical-green-500 transition"
            />
            <p className="text-sm text-gray-600 mt-1">Displayed: <span className="font-medium">{amountDisplay}</span></p>
            {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount}</p>}
          </div>
          <div>
            <button type="submit" disabled={loading} className="w-full glass-btn px-4 py-3 rounded-md disabled:opacity-60 font-semibold text-lg">
              {loading ? "Submitting..." : "Register"}
            </button>
            {errors.form && <p className="text-sm text-red-600 mt-2">{errors.form}</p>}
            {successId && <p className="text-sm text-green-700 mt-2 text-center">Registration created — redirecting...</p>}
          </div>

          <div className="flex items-center justify-center gap-4 pt-6 mt-6 border-t border-gray-200">
            <span className="text-xs text-gray-500 font-medium">We're powered with</span>
            <Image src="/images/combanklogo2.png" alt="Commercial Bank" width={150} height={24} className="object-contain" />
            <Image src="/images/visalogo.png" alt="Visa" width={80} height={24} className="object-contain" />
            <Image src="/images/mastercardlogo.png" alt="Mastercard" width={80} height={24} className="object-contain" />
          </div>
        </form>
      </GlassCard>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        <Suspense fallback={<p className="p-8">Loading...</p>}>
          <RegisterForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
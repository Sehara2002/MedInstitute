"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { courses } from "@/data/courses";
import { exams } from "@/data/exams";
import { ALL_COUNTRIES } from "@/data/countries";
import { parsePriceToNumber } from "@/lib/price";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const idParam = params.get("id") || "";

  // Course & Mode Selection
  const [course, setCourse] = useState("");
  const [courseItem, setCourseItem] = useState<any>(null);
  const [amount, setAmount] = useState<number>(0);
  const [amountLabel, setAmountLabel] = useState<string>("");
  const [amountEditable, setAmountEditable] = useState(false);
  const [modeOptions, setModeOptions] = useState<{ mode: string; fee: string }[]>([]);
  const [selectedMode, setSelectedMode] = useState<string>("");

  // Personal Information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("United Kingdom");
  const [address, setAddress] = useState("");

  // LMS Account Access Credentials
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [successId, setSuccessId] = useState<string | null>(null);

  // Maximum date for DOB (must be at least 18 years old)
  const maxDobDate = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().split("T")[0];
  }, []);

  useEffect(() => {
    const foundCourse = courses.find((c) => c.id === idParam);
    const foundExam = exams.find((e) => e.id === idParam);
    const found = foundCourse || foundExam;

    if (found) {
      setCourseItem(found);
      setCourse(found.title);

      if ("modePricing" in found && found.modePricing && found.modePricing.length > 0) {
        setModeOptions(found.modePricing);
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
    return amount > 0 ? `${process.env.NEXT_PUBLIC_CURRENCY || "LKR"} ${amount.toLocaleString()}` : amountLabel || "0";
  }, [amount, amountLabel]);

  function validate() {
    const e: { [k: string]: string } = {};

    if (!firstName.trim() || firstName.trim().length < 2) {
      e.firstName = "First name must be at least 2 characters long";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      e.email = "Please enter a valid email address (e.g. doctor@example.com)";
    }

    if (phone.trim()) {
      const digitsOnly = phone.replace(/\D/g, "");
      if (digitsOnly.length < 7 || digitsOnly.length > 16) {
        e.phone = "Please enter a valid phone number (minimum 7 digits)";
      }
    }

    if (dob) {
      const birthDate = new Date(dob);
      const minAgeDate = new Date();
      minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);
      if (birthDate > minAgeDate) {
        e.dob = "Candidate must be at least 18 years of age";
      }
    }

    if (!password || password.length < 8) {
      e.password = "Password must be at least 8 characters long";
    }

    if (password !== confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }

    if (modeOptions.length > 0 && !selectedMode) {
      e.mode = "Please select your preferred attendance mode";
    }

    if (amount <= 0) {
      e.amount = "A valid course tuition fee is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const courseLabel = selectedMode ? `${course} (${selectedMode})` : course;

      const payload = {
        firstName,
        lastName,
        email,
        phone,
        dob,
        country,
        address,
        password,
        courseId: idParam,
        course: courseLabel,
        amount,
        mode: selectedMode,
      };

      const res = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLoading(false);

      if (data?.registration?.id) {
        setSuccessId(data.registration.id);
        setTimeout(() => {
          router.push(`/register/summary?id=${data.registration.id}`);
        }, 800);
      } else {
        setErrors({ form: data?.error || "Registration failed. Please check your information." });
      }
    } catch (err) {
      setLoading(false);
      setErrors({ form: "Network error. Please try again." });
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-6">
      {/* Top Banner / Heading */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-semibold mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          MRCGP (INT) Candidate Enrollment
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Candidate Registration
        </h1>
        <p className="text-sm md:text-base text-slate-600 mt-2 max-w-xl mx-auto">
          Complete your registration below. Once registered, your profile will be provisioned in the LMS and you will proceed to secure payment.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ==================================================================== */}
        {/* SECTION 1: COURSE & ATTENDANCE TRACK */}
        {/* ==================================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h2 className="text-sm font-bold text-slate-900">
                Course Track & Attendance Mode
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">Step 1 of 3</span>
          </div>

          <div className="p-6 space-y-5">
            {/* Selected Course Info Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {course || "MRCGP Preparation Track"}
                  </h3>
                  {courseItem?.duration && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      Schedule: <span className="font-medium text-slate-700">{courseItem.duration}</span>
                    </p>
                  )}
                  {courseItem?.level && (
                    <span className="inline-block mt-1 text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {courseItem.level}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right md:shrink-0">
                <span className="text-xs text-slate-500 block">Tuition Fee</span>
                <span className="text-lg font-extrabold text-emerald-700">
                  {amountDisplay}
                </span>
              </div>
            </div>

            {/* Attendance Mode Selection (Online vs Physical) */}
            {modeOptions.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Select Attendance Format <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {modeOptions.map((opt) => {
                    const isSelected = selectedMode === opt.mode;
                    return (
                      <label
                        key={opt.mode}
                        onClick={() => handleModeSelect(opt.mode, opt.fee)}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="attendanceMode"
                            checked={isSelected}
                            onChange={() => handleModeSelect(opt.mode, opt.fee)}
                            className="accent-emerald-600 w-4 h-4 cursor-pointer"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              {opt.mode} Attendance
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {opt.mode.toLowerCase().includes("online")
                                ? "Live interactive sessions via Zoom/Vimeo"
                                : "In-person participation with live roleplay"}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-700">
                          {opt.fee}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.mode && <p className="text-xs text-rose-600 mt-1.5">{errors.mode}</p>}
              </div>
            )}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SECTION 2: CANDIDATE PERSONAL DETAILS */}
        {/* ==================================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h2 className="text-sm font-bold text-slate-900">
                Personal Information & Contact
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">Step 2 of 3</span>
          </div>

          <div className="p-6 space-y-4">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Sarah"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs py-2.5 pl-9 pr-3 text-slate-800 font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                </div>
                {errors.firstName && <p className="text-xs text-rose-600 mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Last Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Jenkins"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs py-2.5 pl-9 pr-3 text-slate-800 font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Email Address & Contact Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="doctor@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs py-2.5 pl-9 pr-3 text-slate-800 font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                <p className="text-[11px] text-slate-400 mt-1">
                  Your LMS course materials and confirmation receipt will be sent here.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Mobile / WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+44 7700 900077 or +94 77 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9+\s\-()]/g, ""))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs py-2.5 pl-9 pr-3 text-slate-800 font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                </div>
                {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Country of Residence & Date of Birth */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Country of Practice / Residence
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs py-2.5 pl-9 pr-3 text-slate-800 font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  >
                    {ALL_COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    max={maxDobDate}
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs py-2.5 pl-9 pr-3 text-slate-800 font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                </div>
                {errors.dob && <p className="text-xs text-rose-600 mt-1">{errors.dob}</p>}
              </div>
            </div>

            {/* Practice / Residential Address */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Address / Clinic Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Street name, City, Postal Code"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs py-2.5 pl-9 pr-3 text-slate-800 font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SECTION 3: LMS ACCOUNT CREDENTIALS */}
        {/* ==================================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h2 className="text-sm font-bold text-slate-900">
                LMS Student Account Password
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">Step 3 of 3</span>
          </div>

          <div className="p-6 space-y-4">
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-sky-800 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                You will use this password together with your email to log into the <strong>MRCGP LMS Student Portal</strong> to view lecture recordings, study materials, and take exams.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Create Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs py-2.5 pl-9 pr-10 text-slate-800 font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs py-2.5 pl-9 pr-3 text-slate-800 font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-rose-600 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SUBMISSION & PAYMENT GATEWAY FOOTER */}
        {/* ==================================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Payable Now</span>
              <div className="text-2xl font-black text-emerald-700 mt-0.5">
                {amountDisplay}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Processed securely via Mastercard Payment Gateway Services (MPGS)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md transition disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Registering & Initializing Checkout...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Proceed to Secure Payment</span>
                </>
              )}
            </button>
          </div>

          {errors.form && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {successId && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Registration completed! Forwarding to secure payment checkout...</span>
            </div>
          )}

          {/* Bank / Gateway Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <span className="text-xs text-slate-400 font-medium">Secured with</span>
            <Image src="/images/combanklogo2.png" alt="Commercial Bank" width={140} height={24} className="object-contain" />
            <Image src="/images/visalogo.png" alt="Visa" width={70} height={20} className="object-contain" />
            <Image src="/images/mastercardlogo.png" alt="Mastercard" width={70} height={20} className="object-contain" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/60 py-12 px-4">
        <Suspense fallback={<div className="max-w-md mx-auto text-center py-20 text-slate-500">Loading form...</div>}>
          <RegisterForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
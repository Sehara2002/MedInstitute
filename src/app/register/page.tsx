"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { courses } from "@/data/courses";
import { parsePriceToNumber } from "@/lib/price";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { UIDatePicker } from "@/components/common/UIDatePicker";
import { UISelect } from "@/components/common/UISelect";
import Image from "next/image";
import { ALL_COUNTRIES } from "@/data/countries";
import {
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Clock,
  Users,
  Check,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const baseInput =
  "w-full bg-slate-50 border rounded-xl text-xs py-2.5 pl-9 text-slate-800 font-medium focus:outline-none focus:bg-white transition";

function fieldCls(hasError: boolean, pr = "pr-3") {
  return `${baseInput} ${pr} ${
    hasError ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-emerald-600"
  }`;
}

const FIELD_ORDER = [
  "course",
  "mode",
  "firstName",
  "lastName",
  "email",
  "phone",
  "dob",
  "country",
  "amount",
];

const STEPS = [
  { step: 1, label: "Course Details" },
  { step: 2, label: "Candidate Information" },
  { step: 3, label: "Tuition & Payment" },
];

const STEP_FIELDS: { [step: number]: string[] } = {
  1: ["course", "mode"],
  2: ["firstName", "lastName", "email", "phone", "dob", "country"],
  3: ["amount"],
};

function stepOfField(key: string) {
  return Number(Object.keys(STEP_FIELDS).find((s) => STEP_FIELDS[Number(s)].includes(key))) || 1;
}

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const idParam = params.get("id") || "";
  const regIdParam = params.get("regId") || "";
  const stepParam = params.get("step") || "";

  // Course & Mode Selection
  const [course, setCourse] = useState("");
  const [courseItem, setCourseItem] = useState<any>(null);
  const [amount, setAmount] = useState<number>(0);
  const [amountLabel, setAmountLabel] = useState<string>("");
  const [amountEditable, setAmountEditable] = useState(false);

  // Mode-pricing state — only used when the course has modePricing
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

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [successId, setSuccessId] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [savedRegistrationId, setSavedRegistrationId] = useState<string | null>(regIdParam || null);
  const [savingStep2, setSavingStep2] = useState(false);

  // Maximum date for DOB (must be at least 18 years old)
  const maxDobDate = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().split("T")[0];
  }, []);

  // Pre-load registration if regId is in URL (e.g. returning to pay later)
  useEffect(() => {
    if (!regIdParam) return;
    fetch(`/api/registration?id=${regIdParam}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.registration) {
          const r = d.registration;
          if (r.firstName) setFirstName(r.firstName);
          if (r.lastName) setLastName(r.lastName);
          if (r.email) setEmail(r.email);
          if (r.phone) setPhone(r.phone);
          if (r.course) setCourse(r.course);
          if (r.amount) setAmount(r.amount);
          if (stepParam === "3") {
            setStep(3);
          }
        }
      })
      .catch((err) => console.warn("Could not load registration for regId:", err));
  }, [regIdParam, stepParam]);

  useEffect(() => {
    const found = courses.find((c) => c.id === idParam);

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
    } else {
      // Support external items passed via URL parameters
      const titleFromParam = params.get("title") || params.get("course") || "";
      const amountFromParam = params.get("amount") || "";

      if (titleFromParam) {
        setCourse(titleFromParam);
      }

      if (amountFromParam) {
        const p = parsePriceToNumber(amountFromParam);
        if (p !== null && p > 0) {
          setAmount(p);
          setAmountLabel(String(p));
          setAmountEditable(false);
        } else {
          setAmount(0);
          setAmountLabel(amountFromParam || "On Request");
          setAmountEditable(true);
        }
      }
    }
  }, [idParam, params]);

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

  function computeErrors() {
    const e: { [k: string]: string } = {};

    // 1. Course selection validation
    if (!courseItem) {
      e.course = "Please select a course before registering";
    }

    if (modeOptions.length > 0 && !selectedMode) {
      e.mode = "Please select your preferred attendance mode";
    }

    // 2. Personal Details strict validation
    // Name cannot have numbers or symbols (only letters, spaces, hyphens, periods, apostrophes)
    const NAME_REGEX = /^[A-Za-z\s.'-]+$/;

    if (!firstName.trim()) {
      e.firstName = "First name is required";
    } else if (firstName.trim().length < 2) {
      e.firstName = "First name must be at least 2 characters long";
    } else if (!NAME_REGEX.test(firstName.trim())) {
      e.firstName = "Name cannot contain numbers or symbols";
    }

    if (lastName.trim() && !NAME_REGEX.test(lastName.trim())) {
      e.lastName = "Name cannot contain numbers or symbols";
    }

    // Email strict validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      e.email = "Email address is required";
    } else if (!emailRegex.test(email.trim())) {
      e.email = "Please enter a valid email address (e.g. doctor@example.com)";
    }

    // Mobile / WhatsApp international number validation
    const phoneDigits = phone.replace(/\D/g, "");
    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    if (!phone.trim()) {
      e.phone = "Mobile / WhatsApp number is required";
    } else if (!phoneRegex.test(phone.trim()) || phoneDigits.length < 7 || phoneDigits.length > 16) {
      e.phone = "Please enter a valid international mobile number (e.g. +44 7700 900077)";
    }

    // Date of Birth validation (Must be at least 18 years old)
    if (!dob.trim()) {
      e.dob = "Date of birth is required";
    } else {
      const birthDate = new Date(dob);
      const minAgeDate = new Date();
      minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);
      if (isNaN(birthDate.getTime())) {
        e.dob = "Please select a valid date of birth (YYYY-MM-DD)";
      } else if (birthDate > minAgeDate) {
        e.dob = "Candidate must be at least 18 years of age";
      }
    }

    // Country validation
    if (!country.trim()) {
      e.country = "Please select your country of residence / practice";
    }

    // 3. Amount validation (phase 3)
    if (courseItem && amount <= 0) {
      e.amount = "A valid course tuition fee is required";
    }

    return e;
  }

  function validate() {
    const e = computeErrors();
    setErrors(e);
    return e;
  }

  function validateField(key: string) {
    const next = computeErrors()[key];
    setErrors((prev) => {
      const copy = { ...prev };
      if (next) copy[key] = next;
      else delete copy[key];
      return copy;
    });
  }

  function clearError(...keys: string[]) {
    setErrors((prev) => {
      if (!keys.some((k) => prev[k]) && !prev.form) return prev;
      const copy = { ...prev };
      keys.forEach((k) => delete copy[k]);
      delete copy.form;
      return copy;
    });
  }

  function focusField(key: string) {
    const el = document.getElementById(`field-${key}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (el && "focus" in el) (el as HTMLElement).focus({ preventScroll: true });
  }

  function changeStep(next: number) {
    setStep(next);
    setTimeout(() => {
      document.getElementById("registration-progress")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  async function handleNext() {
    const errs = computeErrors();
    const keys = STEP_FIELDS[step];
    const stepErrs: { [k: string]: string } = {};
    keys.forEach((k) => {
      if (errs[k]) stepErrs[k] = errs[k];
    });
    setErrors(stepErrs);
    const firstInvalid = keys.find((k) => stepErrs[k]);
    if (firstInvalid) {
      focusField(firstInvalid);
      return;
    }

    if (step === 2) {
      // In-between Process 2 and Process 3: Save draft on VPS and send Pay Later email
      setSavingStep2(true);
      try {
        const courseLabel = selectedMode ? `${course} (${selectedMode})` : course;
        const payload = {
          id: savedRegistrationId || undefined,
          firstName,
          lastName,
          email,
          phone,
          dob,
          country,
          address,
          courseId: idParam,
          course: courseLabel,
          amount,
          mode: selectedMode,
          sendPayLater: true,
        };

        const res = await fetch("/api/registration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        setSavingStep2(false);

        if (res.status === 409) {
          const errorMsg = data?.error || "An account with this email already exists.";
          setErrors({ form: errorMsg, email: errorMsg });
          focusField("email");
          return;
        }

        if (data?.registration?.id) {
          setSavedRegistrationId(data.registration.id);
          changeStep(3);
        } else {
          const errorMsg = data?.error || "Could not save candidate details. Please review your information.";
          setErrors({ form: errorMsg });
        }
      } catch (err) {
        setSavingStep2(false);
        setErrors({ form: "Network error saving details. Please try again." });
      }
      return;
    }

    changeStep(Math.min(step + 1, 3));
  }

  function handleBack() {
    setErrors({});
    changeStep(Math.max(step - 1, 1));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 3) {
      await handleNext();
      return;
    }
    const errs = validate();
    const firstInvalid = FIELD_ORDER.find((k) => errs[k]);
    if (firstInvalid) {
      const targetStep = stepOfField(firstInvalid);
      if (targetStep !== step) {
        changeStep(targetStep);
        setTimeout(() => focusField(firstInvalid), 100);
      } else {
        focusField(firstInvalid);
      }
      return;
    }
    setLoading(true);

    try {
      const courseLabel = selectedMode ? `${course} (${selectedMode})` : course;

      const payload = {
        id: savedRegistrationId || undefined,
        firstName,
        lastName,
        email,
        phone,
        dob,
        country,
        address,
        courseId: idParam,
        course: courseLabel,
        amount,
        mode: selectedMode,
        sendPayLater: false, // Already sent at Step 2
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
        }, 500);
      } else {
        const errorMsg = data?.error || "Registration failed. Please check your information.";
        if (errorMsg.toLowerCase().includes("email") || res.status === 409) {
          setErrors({ form: errorMsg, email: errorMsg });
          changeStep(2);
          setTimeout(() => focusField("email"), 150);
        } else {
          setErrors({ form: errorMsg });
        }
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
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Candidate Registration
        </h1>
        <p className="text-sm md:text-base text-slate-600 mt-2 max-w-xl mx-auto">
          Complete your registration below. Once registered, your profile will be provisioned in the LMS and you will proceed to secure payment.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* ==================================================================== */}
        {/* PROGRESS BAR: Horizontal connected step indicators */}
        {/* ==================================================================== */}
        <div
          id="registration-progress"
          className="bg-white rounded-2xl border border-slate-200/90 shadow-xs px-4 sm:px-8 py-5 scroll-mt-6"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={3}
          aria-valuenow={step}
          aria-label={`Registration Step ${step}`}
        >
          <div className="flex items-start justify-between w-full max-w-2xl mx-auto">
            {STEPS.map((s, idx) => {
              const done = s.step < step;
              const active = s.step === step;

              return (
                <div key={s.step} className="relative flex flex-col items-center flex-1">
                  {/* Indicator caret above active step */}
                  <div className="h-4 flex items-center justify-center mb-1">
                    {active ? (
                      <ChevronDown className="w-4 h-4 text-emerald-600 stroke-[2.5] animate-bounce duration-1000" />
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                  </div>

                  {/* Circle container with vertically centered connecting track lines */}
                  <div className="relative w-full flex items-center justify-center">
                    {/* Left track segment (from previous step's center to this step's center) */}
                    {idx > 0 && (
                      <div className="absolute left-0 right-1/2 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0">
                        <div
                          className={`h-full bg-emerald-600 transition-all duration-300 ${
                            step >= s.step ? "w-full" : "w-0"
                          }`}
                        />
                      </div>
                    )}

                    {/* Right track segment (from this step's center to next step's center) */}
                    {idx < STEPS.length - 1 && (
                      <div className="absolute left-1/2 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0">
                        <div
                          className={`h-full bg-emerald-600 transition-all duration-300 ${
                            step > s.step ? "w-full" : "w-0"
                          }`}
                        />
                      </div>
                    )}

                    {/* Step Circle Node */}
                    <button
                      type="button"
                      onClick={() => {
                        if (s.step < step) changeStep(s.step);
                      }}
                      disabled={s.step > step}
                      className={`relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                        done
                          ? "bg-emerald-600 text-white cursor-pointer hover:bg-emerald-700 shadow-2xs"
                          : active
                          ? "bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-2xs cursor-default"
                          : "bg-white border-2 border-slate-300 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {done ? (
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[3]" />
                      ) : (
                        <span className="text-xs font-bold">{s.step}</span>
                      )}
                    </button>
                  </div>

                  {/* Step Label below circle */}
                  <span
                    className={`mt-2 text-xs sm:text-sm text-center transition-colors px-1 ${
                      active
                        ? "font-bold text-slate-900"
                        : done
                        ? "font-semibold text-slate-700 cursor-pointer hover:text-emerald-700"
                        : "font-medium text-slate-400"
                    }`}
                    onClick={() => {
                      if (s.step < step) changeStep(s.step);
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* PHASE 1: FULL COURSE DETAILS & ATTENDANCE FORMAT (NO PRICE) */}
        {/* ==================================================================== */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Course Overview & Syllabus
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Review curriculum highlights and select your preferred attendance format
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Course Title & Header Card (NO PRICE) */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/20 border border-slate-200/80">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {courseItem?.level && (
                      <span className="text-[11px] font-bold text-sky-800 bg-sky-100/80 px-2.5 py-0.5 rounded-full border border-sky-200">
                        {courseItem.level}
                      </span>
                    )}
                    {courseItem?.duration && (
                      <span className="text-[11px] font-medium text-slate-700 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 flex items-center gap-1 shadow-2xs">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        Schedule: {courseItem.duration}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">
                    {course || "MRCGP Preparation Track"}
                  </h3>

                  {courseItem?.description && (
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-2xl">
                      {courseItem.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Full Curriculum / Key Topics */}
              {courseItem?.curriculum && courseItem.curriculum.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>Comprehensive Curriculum & Core Modules</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {courseItem.curriculum.map((topic: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 text-xs text-slate-700 hover:bg-slate-50 transition"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium leading-snug">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Target Audience */}
              {courseItem?.targetAudience && courseItem.targetAudience.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>Who This Course Is For</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {courseItem.targetAudience.map((item: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200/70"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Format & Schedule */}
              {courseItem?.mode && Array.isArray(courseItem.mode) && courseItem.mode.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Session Timings & Format Details</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {courseItem.mode.map((item: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Attendance Mode Selection (Without Fee Display) */}
              {modeOptions.length > 0 && (
                <div id="field-mode" tabIndex={-1} className="space-y-3 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-800">
                    Choose Your Attendance Format <span className="text-rose-500">*</span>
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
                        </label>
                      );
                    })}
                  </div>
                  {errors.mode && <p className="text-xs text-rose-600 mt-1">{errors.mode}</p>}
                </div>
              )}

              {!courseItem && (
                <div
                  id="field-course"
                  tabIndex={-1}
                  className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    We couldn&apos;t find the selected course. Please choose a course from the{" "}
                    <Link href="/courses" className="font-bold underline">
                      courses page
                    </Link>{" "}
                    to continue.
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* PHASE 2: CANDIDATE PERSONAL DETAILS (NO PASSWORD, NO PRICE) */}
        {/* ==================================================================== */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Candidate Information
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Enter your contact and personal information for registration
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                {/* Names (No numbers or symbols allowed) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      First Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        id="field-firstName"
                        name="firstName"
                        autoComplete="given-name"
                        placeholder="e.g. Sarah"
                        value={firstName}
                        aria-invalid={!!errors.firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          clearError("firstName");
                        }}
                        onBlur={() => validateField("firstName")}
                        className={fieldCls(!!errors.firstName)}
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
                        id="field-lastName"
                        name="lastName"
                        autoComplete="family-name"
                        placeholder="e.g. Jenkins"
                        value={lastName}
                        aria-invalid={!!errors.lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          clearError("lastName");
                        }}
                        onBlur={() => validateField("lastName")}
                        className={fieldCls(!!errors.lastName)}
                      />
                    </div>
                    {errors.lastName && <p className="text-xs text-rose-600 mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email & International Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        id="field-email"
                        name="email"
                        autoComplete="email"
                        placeholder="doctor@example.com"
                        value={email}
                        aria-invalid={!!errors.email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          clearError("email");
                        }}
                        onBlur={() => validateField("email")}
                        className={fieldCls(!!errors.email)}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                    <p className="text-[11px] text-slate-400 mt-1">
                      Your course enrollment and receipts will be linked to this email.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Mobile / WhatsApp Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        id="field-phone"
                        name="phone"
                        autoComplete="tel"
                        placeholder="+44 7700 900077 or +94 77 123 4567"
                        value={phone}
                        aria-invalid={!!errors.phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/[^0-9+\s\-()]/g, ""));
                          clearError("phone");
                        }}
                        onBlur={() => validateField("phone")}
                        className={fieldCls(!!errors.phone)}
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
                    <p className="text-[11px] text-slate-400 mt-1">
                      Include country code for international communication.
                    </p>
                  </div>
                </div>

                {/* Country (Custom UISelect) & Date of Birth (Custom UIDatePicker, 18+ required) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div id="field-country" className="relative z-30">
                    <UISelect
                      label="Country of Residence / Practice"
                      required
                      searchable
                      searchPlaceholder="Search country..."
                      icon={<Globe className="w-4 h-4 text-slate-400" />}
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        clearError("country");
                      }}
                      error={errors.country}
                      options={ALL_COUNTRIES.map((c) => ({ value: c, label: c }))}
                    />
                  </div>

                  <div id="field-dob" className="relative z-30">
                    <UIDatePicker
                      id="dob"
                      name="dob"
                      label="Date of Birth"
                      required
                      max={maxDobDate}
                      placeholder="YYYY-MM-DD"
                      value={dob}
                      onChange={(e) => {
                        setDob(e.target.value);
                        clearError("dob");
                      }}
                      error={errors.dob}
                      helperText="Candidate must be at least 18 years of age."
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="relative z-10">
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Address / Clinic Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="field-address"
                      name="address"
                      placeholder="Street name, City, Postal Code"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs py-2.5 pl-9 pr-3 text-slate-800 font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* PHASE 3: COURSE PRICE DETAILS & SECURE PAYMENT */}
        {/* ==================================================================== */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Tuition Fee Breakdown & Payment
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Review your order summary and proceed to secure card payment
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Registration Summary Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Registration Summary
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Selected Course:</span>
                    <span className="font-bold text-slate-900">{course || "MRCGP Preparation Track"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Attendance Format:</span>
                    <span className="font-bold text-slate-900">
                      {selectedMode ? `${selectedMode} Attendance` : "Full Program"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Candidate Name:</span>
                    <span className="font-bold text-slate-900">
                      {firstName} {lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Registered Email:</span>
                    <span className="font-bold text-slate-900">{email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Contact Phone:</span>
                    <span className="font-bold text-slate-900">{phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Country:</span>
                    <span className="font-bold text-slate-900">{country}</span>
                  </div>
                </div>
              </div>

              {/* Price Details Breakdown */}
              <div className="p-5 rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/30 space-y-3.5">
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>Course Tuition Fee</span>
                  <span className="font-bold text-slate-900">{amountDisplay}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>MRCGP LMS Student Portal Provisioning</span>
                  <span className="font-semibold text-emerald-700">Included (Free)</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>Lecture Recordings & Study Materials</span>
                  <span className="font-semibold text-emerald-700">Included</span>
                </div>

                <div className="pt-3 border-t border-emerald-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Total Tuition Payable Now</span>
                    <span className="text-[11px] text-slate-500">Processed securely in Sri Lankan Rupees</span>
                  </div>
                  <div className="text-2xl font-black text-emerald-700">
                    {amountDisplay}
                  </div>
                </div>
              </div>

              {errors.amount && (
                <p id="field-amount" tabIndex={-1} className="text-xs text-rose-600">
                  {errors.amount}
                </p>
              )}

              {/* Payment Processing Notice & Trust */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Processed securely via <strong>Mastercard Payment Gateway Services (MPGS)</strong> by <strong>Commercial Bank of Ceylon</strong> with 256-bit SSL encryption.
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-slate-200/60">
                  <span className="text-xs text-slate-400 font-medium">Supported Payment Methods:</span>
                  <Image src="/images/combanklogo2.png" alt="Commercial Bank" width={130} height={22} className="object-contain" />
                  <Image src="/images/visalogo.png" alt="Visa" width={60} height={18} className="object-contain" />
                  <Image src="/images/mastercardlogo.png" alt="Mastercard" width={60} height={18} className="object-contain" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* STEP NAVIGATION FOOTER (NO PRICE IN STEPS 1 & 2, NO STEP 1 OF 3 LABELS) */}
        {/* ==================================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {step === 1 && (
                <span className="text-xs font-medium text-slate-500">
                  Course curriculum highlights & attendance selection
                </span>
              )}
              {step === 2 && (
                <span className="text-xs font-medium text-slate-500">
                  Candidate contact details & country of practice
                </span>
              )}
              {step === 3 && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">Total Payable Now</span>
                  <span className="text-xl font-black text-emerald-700">{amountDisplay}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              {step > 1 && (
                <button
                  key="back"
                  type="button"
                  onClick={handleBack}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition disabled:opacity-60 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}

              {step < 3 && (
                <button
                  key="next"
                  type="button"
                  onClick={handleNext}
                  disabled={!courseItem || savingStep2}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition disabled:opacity-60 cursor-pointer"
                >
                  {savingStep2 ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving & Sending Details...</span>
                    </>
                  ) : (
                    <>
                      <span>{step === 1 ? "Next: Candidate Information" : "Next: Review & Payment"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}

              {step === 3 && (
                <button
                  key="submit"
                  type="submit"
                  disabled={loading || !courseItem}
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
                      <span>Proceed to Payment</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {errors.form && (
            <div className="p-3 mt-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {successId && (
            <div className="p-3 mt-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Registration completed! Forwarding to secure payment checkout...</span>
            </div>
          )}
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
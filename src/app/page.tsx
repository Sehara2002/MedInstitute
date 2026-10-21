import Link from "next/link";
import {
  ArrowRight,
  Activity,
  Users,
  Award,
  BookOpen,
  CalendarCheck,
  GraduationCap,
  ClipboardCheck,
  Stethoscope,
  FileText,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/PageHeader";
import { TypewriterEffect } from "@/components/TypewriterEffect";
import { TestimonialCard } from "@/components/TestimonialCard";
import { SessionGallery } from "@/components/SessionGallery";
import { testimonials } from "@/data/testimonials";
// import ExamPost from "@/data/images/Posts/exam_post4.png";
import ExamPost from "@/data/images/Posts/exam_post5.png";
import { PosterSlideshow, type PosterSlide } from "@/components/PosterSlideshow";
import { getFeaturedSlides } from "@/lib/featured";

/** The standing promotions: shown after anything an admin has featured in the LMS */
const standingSlides: PosterSlide[] = [
  {
    src: ExamPost,
    href: "/exams",
    alt: "Family Medicine Forum - MRCGP INT OSCE Mock Exam",
    cornerTags: { topLeft: "Limited time offer", bottomRight: "Seats filling fast" },
  },
  {
    src: "/images/new-osce-flyer.jpeg",
    href: "/courses/mrcgp-int-osce-5-day-virtual-training-2026",
    alt: "Family Medicine Forum - MRCGP INT OSCE & AKT Training Program by Dr Malkanthi Galhena",
    cornerTags: { topLeft: "Limited time offer", bottomRight: "Seats filling fast" },
  },
];

const pathways = [
  {
    href: "/courses",
    icon: BookOpen,
    title: "Browse courses",
    text: "Structured MRCGP [INT] programmes with recordings, materials and marking grids.",
    cta: "View courses",
  },
  {
    href: "/exams",
    icon: CalendarCheck,
    title: "Book a mock exam",
    text: "Practise under real exam conditions and reserve a numbered seat online.",
    cta: "See mock exams",
  },
  {
    href: "https://lms.mrcgpfasttrack.com",
    icon: GraduationCap,
    title: "Enter the LMS portal",
    text: "Already enrolled? Continue your lessons, quizzes and practice questions.",
    cta: "Go to the portal",
  },
];

const reasons = [
  {
    icon: ClipboardCheck,
    title: "Exam-focused",
    text: "Teaching methodology aimed squarely at improving first-attempt success in the MRCGP exams.",
    tone: "bg-medical-blue-50 text-medical-blue-700 ring-medical-blue-100",
  },
  {
    icon: Stethoscope,
    title: "Experienced faculty",
    text: "Learn from clinicians with extensive exposure to postgraduate medical training and examining.",
    tone: "bg-medical-green-50 text-medical-green-700 ring-medical-green-100",
  },
  {
    icon: FileText,
    title: "Guideline-based",
    text: "Clinically relevant content built on the latest guidelines and medical evidence.",
    tone: "bg-ink-50 text-ink-700 ring-ink-100",
  },
];

const steps = [
  { title: "Choose your programme", text: "Pick the course or mock exam that fits your exam date and study style." },
  { title: "Register and pay online", text: "Secure card payment. Your confirmation and LMS login details arrive by email." },
  { title: "Learn and practise", text: "Join sessions, watch recordings, use the marking grids and test yourself in the LMS." },
];

// Featured items come live from the LMS, so this page is rendered on each visit
export const dynamic = "force-dynamic";

export default async function Home() {
  const featuredSlides = await getFeaturedSlides();

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-white">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid-faint [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />
          <div aria-hidden="true" className="absolute -right-32 -top-32 -z-10 h-[520px] w-[520px] rounded-full bg-medical-green-100/70 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-40 left-0 -z-10 h-[420px] w-[420px] rounded-full bg-medical-blue-100/60 blur-3xl" />

          <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-16 lg:px-8 lg:py-20">
            <div className="order-2 lg:order-1">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-medical-green-200 bg-medical-green-50 px-4 py-1.5 text-sm font-semibold text-medical-green-800">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-medical-green-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-medical-green-600" />
                </span>
                MRCGP [INT] · OSCE &amp; AKT preparation
              </span>

              <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] text-ink-900 sm:text-5xl lg:text-[3.5rem]">
                Marking-grid guided training for{" "}
                <span className="text-medical-green-600">MRCGP [INT]</span> success
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
                Evidence-based, up-to-date knowledge to help you deliver patient-centred first-contact care, and pass
                with confidence. Shaping the future of doctors locally and globally.
              </p>

              {/* Rotating highlight */}
              <div className="mt-6 flex min-h-[4.5rem] max-w-xl items-start gap-3 rounded-xl border border-ink-100 bg-ink-50/70 px-4 py-3">
                <PlayCircle className="mt-0.5 h-5 w-5 shrink-0 text-medical-green-600" aria-hidden="true" />
                <TypewriterEffect
                  texts={[
                    "Master unique skills in MRCGP [INT] examinations with a 12-year experienced examiner",
                    "Mock examinations in MRCGP International OSCE/AKT for success in the first attempt",
                    "For global postgraduate qualifications in General Practice / Primary Care",
                    "Evidence-based management aligned training",
                    "Structured clinical skills",
                    "Course materials with clinical case scenario practice videos and marking grid",
                    "Summarised, updated practice guidelines",
                    "Individual & group training",
                  ]}
                  speed={70}
                  pause={2400}
                  className="text-sm font-medium leading-relaxed text-ink-700 sm:text-base"
                />
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/courses/mrcgp-chennai-exam-2026" className="btn-primary group !px-7 !py-3.5 text-base">
                  Register to webinar
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <Link href="/signup" className="btn-secondary !px-7 !py-3.5 text-base">
                  Sign up for free
                </Link>
              </div>

              {/* Trust strip */}
              <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-ink-100 pt-8">
                {[
                  { icon: Award, value: "12+ years", label: "Examiner experience" },
                  { icon: Users, value: "1000+", label: "Candidates guided" },
                  { icon: Activity, value: "High", label: "First-attempt success" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <stat.icon className="mb-2 h-5 w-5 text-medical-green-600" aria-hidden="true" />
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="font-display text-xl font-extrabold leading-none text-ink-900 sm:text-2xl">{stat.value}</dd>
                    <p className="mt-1.5 text-xs leading-snug text-ink-500">{stat.label}</p>
                  </div>
                ))}
              </dl>
            </div>

            {/* Poster */}
            <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
              <div className="relative w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[480px]">
                <div aria-hidden="true" className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-medical-green-200 to-medical-blue-200 opacity-70 blur-2xl" />
                <div className="relative">
                  <PosterSlideshow
                    slides={[...featuredSlides, ...standingSlides]}
                    intervalMs={5000}
                    className="shadow-lift ring-1 ring-ink-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Where to start */}
        <section className="relative -mt-px border-y border-ink-100 bg-ink-50/60 py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Get started"
              title="Where would you like to begin?"
              description="Everything you need for your MRCGP [INT] journey, in one place."
            />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {pathways.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="group flex flex-col rounded-2xl border border-ink-100 bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-medical-green-200 hover:shadow-lift"
                >
                  <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-medical-green-50 text-medical-green-700 ring-1 ring-medical-green-100 transition-colors group-hover:bg-medical-green-600 group-hover:text-white">
                    <p.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-xl font-extrabold text-ink-900">{p.title}</h3>
                  <p className="mt-2 flex-grow text-sm leading-relaxed text-ink-600">{p.text}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-medical-green-700">
                    {p.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="bg-white py-16 sm:py-24">
          <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
            <div>
              <span className="eyebrow mb-3">About us</span>
              <h2 className="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl md:text-4xl">
                About Family Medicine Forum
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ink-600 sm:text-lg">
                Family Medicine Forum is a professional academic platform dedicated to supporting doctors pursuing
                careers and postgraduate qualifications in Family Medicine and Primary Care.
              </p>
              <p className="mt-4 text-base leading-relaxed text-ink-600 sm:text-lg">
                We specialise in exam-focused preparatory courses for doctors appearing for the MRCGP International
                (INT) examinations.
              </p>
              <Link href="/staff" className="btn-secondary mt-8">
                Meet our faculty
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="rounded-3xl border border-medical-green-100 bg-gradient-to-br from-medical-green-50 to-white p-7 sm:p-9">
              <p className="text-sm font-bold uppercase tracking-wider text-medical-green-800">Our emphasis</p>
              <ul className="mt-5 space-y-5">
                {[
                  ["Examiner expectations", "Understand exactly what examiners look for and how marks are awarded."],
                  ["Real-world clinical reasoning", "Practise the thinking you will use with patients, not just for the exam."],
                  ["Structured consultation skills", "Build a consistent, repeatable approach to every station."],
                ].map(([title, text]) => (
                  <li key={title} className="flex gap-4">
                    <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-medical-green-600" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-ink-900">{title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-600">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Why choose us */}
        <section className="border-y border-ink-100 bg-ink-50/60 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Why us" title="Why choose Family Medicine Forum" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {reasons.map((r) => (
                <div key={r.title} className="rounded-2xl border border-ink-100 bg-white p-8 shadow-soft">
                  <span className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${r.tone}`}>
                    <r.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-xl font-extrabold text-ink-900">{r.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-600">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="How it works" title="From registration to exam day in three steps" />
            <ol className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
              {steps.map((step, i) => (
                <li key={step.title} className="relative">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-medical-green-600 font-display text-lg font-extrabold text-white shadow-sm">
                    {i + 1}
                  </span>
                  {i < steps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-16 right-0 top-6 hidden border-t-2 border-dashed border-medical-green-200 md:block"
                    />
                  )}
                  <h3 className="mt-5 font-display text-lg font-extrabold text-ink-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Session Gallery */}
        <SessionGallery />

        {/* Testimonials Preview */}
        <section className="bg-white py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Success stories" title="What our students say" />

            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {testimonials.slice(0, 3).map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>

            <div className="text-center">
              <Link href="/testimonials" className="inline-flex items-center gap-2 font-semibold text-medical-green-700 transition-colors hover:text-medical-green-800">
                View all success stories <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="px-4 pb-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="relative isolate overflow-hidden rounded-3xl bg-ink-900 px-6 py-14 text-center sm:px-12 sm:py-20">
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-br from-ink-900 via-ink-900 to-medical-green-900" />
              <div aria-hidden="true" className="absolute -left-20 -top-20 -z-10 h-64 w-64 rounded-full bg-medical-green-500/25 blur-3xl" />
              <div aria-hidden="true" className="absolute -bottom-24 -right-16 -z-10 h-72 w-72 rounded-full bg-medical-blue-500/20 blur-3xl" />
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold text-white md:text-4xl">
                Ready to take the next step?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-200 sm:text-lg">
                Contact us today to enrol in our upcoming MRCGP [INT] preparatory courses and start your journey
                towards excellence.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-ink-900 shadow-sm transition-colors hover:bg-medical-green-50"
                >
                  Contact us to enrol
                </Link>
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Browse courses
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import Link from "next/link";
import { ArrowRight, Activity, Users, Award } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { TypewriterEffect } from "@/components/TypewriterEffect";
import { TestimonialCard } from "@/components/TestimonialCard";
import { SessionGallery } from "@/components/SessionGallery";
import { testimonials } from "@/data/testimonials";
import ExamPost from "@/data/images/Posts/exam_post3.jpeg";
import { FlipCard } from "@/components/FlipCard";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_520px] items-center gap-12 min-h-[580px]">

            {/* Text Column — shows SECOND on mobile, FIRST on desktop */}
            <div className="flex-1 max-w-4xl order-2 lg:order-1">

              {/* Eyebrow badge — live indicator dot instead of a flat pill */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-medical-green-100/80 backdrop-blur-sm mb-6 shadow-sm ring-1 ring-medical-green-200/60">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-medical-green-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-medical-green-600" />
                </span>
                <span className="text-medical-green-700 font-semibold text-sm">
                  Empowering Doctors in Primary Care & MRCGP [INT] Success
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-8">
                Marking Grid{" "}
                <span className="bg-gradient-to-r from-medical-green-600 to-medical-green-400 bg-clip-text text-transparent">
                  Guided Training
                </span>
                <br />
                <TypewriterEffect
                  texts={[
                    "Master unique skills in MRCGP [INT] Examinations With a 12 Years Experienced Examiner",
                    "Mock Examinations in MRCGP International exam OSCE/AKT for success in first attempt",
                    "For Global PG Qualifications in General Practice / Primary Care",
                    "Evidence-Based Management aligned Training",
                    "Structured Clinical Skills",
                    "Course Materials with Clinical Case Scenario Practice Videos with Marking Grid",
                    "Summarized updated practice guidelines",
                    "Individual & Group Training"
                  ]}
                  speed={70}
                  pause={2000}
                  className="bg-gradient-to-r from-medical-blue-600 to-medical-blue-400 bg-clip-text text-transparent block"
                />
              </h1>

              <p className="text-xl text-gray-700 mb-10 leading-relaxed max-w-2xl">
                We provide evidence-based, updated knowledge to facilitate patient-centered first contact care.
                Shaping the future of doctors locally and globally.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  href="/exams"
                  className="group px-8 py-4 rounded-full bg-red-600 text-white font-semibold shadow-lg shadow-medical-green-600/30 hover:bg-medical-green-500 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  Register to Exam
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 rounded-full bg-white/60 backdrop-blur-md border border-white/70 text-gray-800 font-semibold hover:bg-white/90 hover:-translate-y-0.5 transition-all shadow-sm"
                >
                  Contact Us
                </Link>
              </div>

              {/* Trust stat strip */}
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-8 border-t border-gray-200/70">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-medical-blue-100 text-medical-blue-600">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 leading-none">12+ Years</p>
                    <p className="text-xs text-gray-500 mt-1">Examiner Experience</p>
                  </div>
                </div>

                <div className="hidden sm:block h-9 w-px bg-gray-200" />

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-medical-green-100 text-medical-green-600">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 leading-none">1000+</p>
                    <p className="text-xs text-gray-500 mt-1">Candidates Guided</p>
                  </div>
                </div>

                <div className="hidden sm:block h-9 w-px bg-gray-200" />

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 leading-none">High</p>
                    <p className="text-xs text-gray-500 mt-1">First-Attempt Success</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image with Promo Highlight — shows FIRST on mobile, SECOND on desktop */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="relative w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[520px]">

                {/* Animated glow ring behind the poster */}
                <div className="absolute -inset-2 rounded-[28px] bg-gradient-to-r from-medical-green-400 via-medical-blue-400 to-medical-green-400 opacity-70 blur-xl animate-pulse" />

                {/* "Limited Time Offer" badge — tilted, top-left */}
                <div className="absolute -top-3 -left-3 sm:-top-5 sm:-left-5 z-20 -rotate-6">
                  <div className="relative">
                    <span className="absolute inset-0 rounded-full bg-red-500 blur-md opacity-60 animate-pulse" />
                    <span className="relative flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide shadow-lg ring-2 ring-white whitespace-nowrap">
                      Limited Time Offer
                    </span>
                  </div>
                </div>

                {/* "Seats filling fast" ribbon — bottom-right */}
                <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 z-20">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-medical-green-600 text-white text-[10px] sm:text-xs font-bold shadow-lg ring-2 ring-white whitespace-nowrap">
                    Seats Filling Fast
                  </span>
                </div>

                {/* The flipping poster */}
                <div className="relative rounded-2xl shadow-2xl ring-1 ring-white/70 overflow-visible">
                  <FlipCard
                    frontSrc={ExamPost}
                    frontHref="/exams"
                    frontAlt="Family Medicine Forum - MRCGP INT OSCE Mock Exam"
                    backSrc="/images/Promotion.jpeg"
                    backHref="/courses"
                    backAlt="Family Medicine Forum - MRCGP INT OSCE & AKT Training Program by Dr Malkanthi Galhena"
                    intervalMs={4000}
                    transitionMs={1400}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-medical-blue-300/20 rounded-full blur-3xl z-0" />
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-medical-green-300/20 rounded-full blur-3xl z-0" />
        </section>

        {/* About Section */}
        <section className="py-16 bg-white/40 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About Family Medicine Forum</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Family Medicine Forum is a professional academic platform dedicated to supporting doctors pursuing careers and postgraduate qualifications in Family Medicine and Primary Care.
                <br /><br />
                We specialize in exam-focused preparatory courses for doctors appearing for MRCGP International (INT) examinations, with a strong emphasis on understanding examiner expectations, real-world clinical reasoning, and structured consultation skills.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section with Glass Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose Family Medicine Forum</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <GlassCard className="p-8 flex items-start gap-4" variant="panel">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                  <Activity className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Exam-Focused</h3>
                  <p className="text-gray-600">Teaching methodology specifically aimed at improving first-attempt success in MRCGP exams.</p>
                </div>
              </GlassCard>
              <GlassCard className="p-8 flex items-start gap-4" variant="panel">
                <div className="p-3 rounded-xl bg-green-100 text-green-600">
                  <Users className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Experienced Faculty</h3>
                  <p className="text-gray-600">Learn from experienced clinicians with extensive exposure to postgraduate medical training.</p>
                </div>
              </GlassCard>
              <GlassCard className="p-8 flex items-start gap-4" variant="panel">
                <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                  <Award className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Guideline Based</h3>
                  <p className="text-gray-600">Clinically relevant content based on the latest guidelines and medical evidence.</p>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Session Gallery */}
        <SessionGallery />

        {/* Testimonials Preview */}
        <div className="py-20 bg-white/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-medical-green-100 text-medical-green-700 font-semibold text-sm mb-4">
                Testimonials
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                What our students say
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {testimonials.slice(0, 3).map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/testimonials"
                className="inline-flex items-center gap-2 text-medical-green-700 font-semibold hover:text-medical-green-800 transition-colors"
              >
                View all success stories <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <GlassCard className="max-w-4xl mx-auto p-12 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to take the next step?</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Contact us today to enroll in our upcoming MRCGP [INT] preparatory courses and start your journey towards excellence.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex px-8 py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors shadow-lg"
                >
                  Contact Us to Enroll
                </Link>
              </div>
              {/* Subtle background decoration within card */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-medical-green-50/50 to-medical-blue-50/50 z-0" />
            </GlassCard>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
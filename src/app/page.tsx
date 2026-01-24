import Link from "next/link";
import { ArrowRight, Activity, Users, Award } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { TypewriterEffect } from "@/components/TypewriterEffect";
import { TestimonialCard } from "@/components/TestimonialCard";
import { testimonials } from "@/data/testimonials";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl">
              <span className="inline-block px-4 py-2 rounded-full bg-medical-green-100/80 text-medical-green-700 font-semibold text-sm mb-6 backdrop-blur-sm">
                Empowering Doctors in Primary Care & MRCGP [INT] Success
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-8 min-h-[3em]">
                Marking Grid <span className="text-medical-green-600">Guided Training</span> {" "}
                <TypewriterEffect
                  texts={[
                    "In Master unique skills in MRCGP [INT] Examinations With 12 Years Experienced Examiner",
                    "For Global PG Qualifications in General Practice / Primary Care",
                    "Evidence-Based Management aligned Training",
                    "Structured Clinical Skills",
                    "Course Materials with Clinical Case Scenario Practice Videos with Marking Grade & Summarized updated practice guidelines.",
                    "Individual & Group Training",
                    "Mock Examinations in MRCGP International exam OSCE/AKT for successful at first attempt",
                  ]}
                  speed={70}
                  pause={2000}
                  className="text-medical-blue-600 block sm:inline"
                />
              </h1>
              <p className="text-xl text-gray-700 mb-10 leading-relaxed max-w-2xl">
                We provide evidence-based, updated knowledge to facilitate patient-centered first contact care.
                Shaping the future of doctors locally and globally.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/courses"
                  className="px-8 py-4 rounded-full bg-medical-green-600 text-white font-semibold shadow-lg hover:bg-medical-green-500 hover:shadow-xl transition-all flex items-center gap-2"
                >
                  View MRCGP Courses <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 rounded-full bg-white/50 backdrop-blur-md border border-white/60 text-gray-800 font-semibold hover:bg-white/70 transition-all shadow-sm"
                >
                  Contact Us
                </Link>
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

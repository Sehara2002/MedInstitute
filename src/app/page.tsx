import Link from "next/link";
import { ArrowRight, Activity, Users, Award } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-2 rounded-full bg-medical-green-100/80 text-medical-green-700 font-semibold text-sm mb-6 backdrop-blur-sm">
                Evidence Based • Patient Centered
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-8">
                Facilitating <span className="text-medical-green-600">Patient Centered</span> First Contact Care
              </h1>
              <p className="text-xl text-gray-700 mb-10 leading-relaxed max-w-2xl">
                Provision of Evidence based updated knowledge to facilitate patient centered first contact care.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/courses"
                  className="px-8 py-4 rounded-full bg-medical-green-600 text-white font-semibold shadow-lg hover:bg-medical-green-500 hover:shadow-xl transition-all flex items-center gap-2"
                >
                  Explore Courses <ArrowRight className="h-5 w-5" />
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

        {/* Stats Section with Glass Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <GlassCard className="p-8 flex items-start gap-4" variant="panel">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                  <Activity className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">PG Doctor Training</h3>
                  <p className="text-gray-600">Training in hands on experiences for training of PG Doctors in Family Medicine (General Practice).</p>
                </div>
              </GlassCard>
              <GlassCard className="p-8 flex items-start gap-4" variant="panel">
                <div className="p-3 rounded-xl bg-green-100 text-green-600">
                  <Users className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Clinical Confidence</h3>
                  <p className="text-gray-600">Training of PG Doctors for build up their clinical confidency during their day to day actvities.</p>
                </div>
              </GlassCard>
              <GlassCard className="p-8 flex items-start gap-4" variant="panel">
                <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                  <Award className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Evidence Based</h3>
                  <p className="text-gray-600">Provision of updated knowledge based on the latest medical evidence to facilitate patient centered care.</p>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <GlassCard className="max-w-4xl mx-auto p-12 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Start Your Medical Journey?</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Enroll today in one of our diverse medical programs and take the first step towards a rewarding career in healthcare.
                </p>
                <Link
                  href="/courses"
                  className="inline-flex px-8 py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors shadow-lg"
                >
                  View All Programs
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

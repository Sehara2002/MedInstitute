import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GlassCard } from "@/components/GlassCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { parseCourseId, type Course } from "@/data/courses";
import { getCourse } from "@/lib/citech";
import { RegisterForm } from "./RegisterForm";

interface PageProps {
  searchParams: Promise<{ id?: string | string[] }>;
}

type Resolved = { course: Course | null } | { notice: string };

async function resolveCourse(id: string): Promise<Resolved> {
  if (parseCourseId(id) !== null) {
    const lookup = await getCourse(id);
    if (lookup.status === "unavailable") {
      return { notice: "Registration for this course is temporarily unavailable. Please try again in a few minutes." };
    }
    if (lookup.status === "not_found") {
      return { notice: "This course is no longer open for registration." };
    }
    const course = lookup.course;
    if (course.isFree) redirect(`/courses/${course.id}`);
    if (!course.acceptsOnlinePayment) {
      return { notice: "Online payment isn't available for this course yet. Please contact us to enroll." };
    }
    return { course };
  }

  // Mock exams are booked on their own pages (/exams)
  return { course: null };
}

export default async function RegisterPage({ searchParams }: PageProps) {
  const { id } = await searchParams;
  const resolved = await resolveCourse(typeof id === "string" ? id : "");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/60 py-12 px-4">
        {"notice" in resolved ? (
          <div className="flex justify-center">
            <GlassCard className="p-10 text-center max-w-xl" variant="panel">
              <p className="text-gray-900 font-semibold mb-6">{resolved.notice}</p>
              <Link
                href="/contact"
                className="inline-block px-6 py-2.5 rounded-xl bg-medical-green-600 text-white font-semibold hover:bg-medical-green-500 transition-colors"
              >
                Contact Us
              </Link>
            </GlassCard>
          </div>
        ) : (
          <Suspense fallback={<div className="max-w-md mx-auto text-center py-20 text-slate-500">Loading form...</div>}>
            <RegisterForm courseItem={resolved.course} />
          </Suspense>
        )}
      </main>
      <Footer />
    </>
  );
}

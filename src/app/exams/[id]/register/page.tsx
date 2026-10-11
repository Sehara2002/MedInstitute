import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { getMockExam, MockExam, MockExamApiError } from "@/lib/mockExams";
import { ExamRegisterForm } from "./ExamRegisterForm";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ExamRegisterPage({ params }: PageProps) {
  const { id } = await params;

  let exam: MockExam | null = null;
  let problem: string | null = null;
  try {
    exam = await getMockExam(id);
    if (!exam.isBookable) {
      problem = exam.availableSlots === 0 ? "Sorry, this mock exam is fully booked." : "Bookings for this mock exam are closed.";
    }
  } catch (err) {
    problem =
      err instanceof MockExamApiError && err.status === 404
        ? "This mock exam could not be found."
        : "We could not load this mock exam. Please try again shortly.";
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        {exam && !problem ? (
          <ExamRegisterForm exam={exam} />
        ) : (
          <GlassCard className="p-8 max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration unavailable</h1>
            <p className="text-gray-600 mb-6">{problem}</p>
            <Link href="/exams" className="glass-btn inline-block px-4 py-2 rounded-md">
              View mock exams
            </Link>
          </GlassCard>
        )}
      </main>
      <Footer />
    </>
  );
}

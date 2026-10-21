import React from "react";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { ExamCard } from "@/components/ExamCard";
import type { MockExam } from "@/lib/mockExams";
import { getMockExams } from "@/lib/mockExams.server";
import { Ticket, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ExamsPage() {
  let exams: MockExam[] = [];
  let loadFailed = false;
  try {
    exams = await getMockExams();
  } catch (err) {
    console.error("[exams] Could not load mock exams from the LMS:", err);
    loadFailed = true;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <PageHeader
          eyebrow="Mock exams"
          title="Practise under real exam conditions"
          description="Test your knowledge and exam readiness with our comprehensive mock exams. Get a real feel for the exam conditions before the big day."
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-medical-green-100 ring-1 ring-white/15">
            <Ticket className="h-4 w-4 shrink-0 text-medical-green-300" aria-hidden="true" />
            <span>Seats are limited. Book and pay online to receive your slot number by email.</span>
          </div>
        </PageHeader>
        <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exams.length > 0 ? (
              exams.map((exam) => <ExamCard key={exam.mockExamId} exam={exam} />)
            ) : (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-ink-100 shadow-soft p-8 max-w-xl mx-auto">
                <ShieldAlert className="h-12 w-12 text-ink-300 mx-auto mb-4" />
                <h3 className="font-display text-lg font-extrabold text-ink-900 mb-2">
                  {loadFailed ? "Mock exams could not be loaded right now" : "No upcoming mock exams available at the moment"}
                </h3>
                <p className="text-sm text-ink-500">
                  {loadFailed
                    ? "Please refresh the page in a moment or contact us for upcoming exam sessions."
                    : "Please check back soon or contact support for scheduled upcoming exam sessions."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

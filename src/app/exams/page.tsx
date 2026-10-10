import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ExamCard } from "@/components/ExamCard";
import { getAllMockExams } from "@/lib/exams";
import { auth } from "@/auth";
import { Lock, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ExamsPage() {
  const session = await auth();
  const userId = session?.user ? (session.user as { id: string }).id : undefined;

  const exams = await getAllMockExams(userId);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Mock <span className="text-medical-green-600">Exams</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Test your knowledge and exam readiness with our comprehensive mock exams.
              Get a real feel for the exam conditions before the big day.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-medical-green-200 text-medical-green-800 text-sm font-medium shadow-xs">
              <Lock className="h-4 w-4 text-medical-green-600" />
              <span>
                Mock exams require registration & payment to unlock your official slot.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exams.length > 0 ? (
              exams.map((exam) => <ExamCard key={exam.id} exam={exam} />)
            ) : (
              <div className="col-span-full text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 p-8 max-w-xl mx-auto">
                <ShieldAlert className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  No upcoming mock exams available at the moment
                </h3>
                <p className="text-sm text-gray-500">
                  Please check back soon or contact support for scheduled upcoming exam sessions.
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

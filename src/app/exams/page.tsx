import React from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ExamCard } from "@/components/ExamCard";
import { exams } from "@/data/exams";

export default function ExamsPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Mock <span className="text-medical-green-600">Exams</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Test your knowledge and exam readiness with our comprehensive mock exams.
                            Get a real feel for the exam conditions before the big day.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {exams.map((exam) => (
                            <ExamCard key={exam.id} exam={exam} />
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

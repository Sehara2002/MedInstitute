import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Exam } from "@/data/exams";

interface ExamCardProps {
    exam: Exam;
}

export function ExamCard({ exam }: ExamCardProps) {
    return (
        <GlassCard className="flex flex-col h-full p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <div className="mb-4">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${exam.type === 'Mock Exam'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-orange-100 text-orange-700'
                    }`}>
                    {exam.type}
                </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3">{exam.title}</h3>
            <p className="text-gray-600 text-sm mb-6 flex-grow">{exam.description}</p>

            <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{exam.date}</span>
                </div>
                {exam.time && (
                    <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{exam.time}</span>
                    </div>
                )}
                <div className="text-lg font-bold text-medical-green-700">
                    {exam.fee}
                </div>
                <div className="text-md font-bold text-red-700">
                    {exam.offer}
                </div>
            </div>

            <Link
                href="/contact#contact-details"
                className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-medical-green-600 text-white font-semibold hover:bg-medical-green-700 transition-colors"
            >
                Register Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </GlassCard>
    );
}

import Link from "next/link";
import { Clock, GraduationCap, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Course } from "@/data/courses";

interface CourseCardProps {
    course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
    return (
        <GlassCard className="flex flex-col overflow-hidden group h-full">
            <div className={`h-48 w-full ${course.imageUrl} flex items-center justify-center p-6`}>
                {/* Placeholder for actual image */}
                <div className="bg-white/30 backdrop-blur-md rounded-full p-4">
                    <GraduationCap className="h-10 w-10 text-white" />
                </div>
            </div>
            <div className="flex flex-col flex-grow p-6">
                <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-medical-blue-50 px-2.5 py-0.5 text-xs font-medium text-medical-blue-700">
                        {course.level}
                    </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-medical-green-600 transition-colors mb-2">
                    {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6 flex-grow">
                    {course.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration}
                    </div>
                    <Link
                        href={`/courses/${course.id}`}
                        className="inline-flex items-center text-sm font-semibold text-medical-green-600 hover:text-medical-green-700 transition-colors"
                    >
                        Details <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </GlassCard>
    );
}

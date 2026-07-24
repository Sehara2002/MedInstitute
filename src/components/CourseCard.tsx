import Link from "next/link";
import { Clock, GraduationCap, ArrowRight, Video } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Course } from "@/data/courses";

interface CourseCardProps {
    course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
    return (
        <GlassCard className="flex flex-col overflow-visible group h-full relative">
            <div className={`relative h-28 w-full ${course.imageUrl} flex items-center justify-center p-4 rounded-t-2xl overflow-hidden`}>
                <div className="bg-white/30 backdrop-blur-md rounded-full p-2.5">
                    <GraduationCap className="h-6 w-6 text-white" />
                </div>
            </div>

            {/* Recordings badge — straddles the image and content sections */}
            <div className="relative z-10 flex justify-center -mt-4">
                <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-medical-green-600 ring-4 ring-white shadow-md flex items-center justify-center">
                        <Video className="h-4 w-4 text-white" />
                    </div>
                    <span className="mt-1 text-[9px] font-bold uppercase tracking-wide text-medical-green-700 bg-white px-1.5 rounded-full">
                        Recordings Available
                    </span>
                </div>
            </div>

            <div className="flex flex-col flex-grow p-4 pt-2 rounded-b-2xl overflow-hidden">
                <div className="mb-2.5 flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
                    <span className="inline-flex items-center rounded-full bg-medical-blue-50 px-2 py-0.5 text-[10px] font-medium text-medical-blue-700">
                        {course.level}
                    </span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-medical-green-600 transition-colors mb-1.5 leading-snug text-center sm:text-left">
                    {course.title}
                </h3>
                <p className="text-gray-600 text-xs mb-3 flex-grow line-clamp-2 text-center sm:text-left">
                    {course.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                    <div className="flex items-center text-gray-500 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {course.duration}
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/register?id=${encodeURIComponent(course.id)}&amount=${encodeURIComponent(String(course.fee || ""))}`}
                            className="inline-flex items-center text-xs font-semibold text-white bg-medical-green-600 px-2.5 py-1 rounded-md shadow-sm hover:bg-medical-green-500 transition-colors"
                        >
                            Register
                        </Link>
                        <Link
                            href={`/courses/${course.id}`}
                            className="inline-flex items-center text-xs font-semibold text-medical-green-600 hover:text-medical-green-700 transition-colors"
                        >
                            Details <ArrowRight className="ml-0.5 h-3 w-3 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
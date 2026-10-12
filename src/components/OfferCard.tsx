import Link from "next/link";
import { ArrowRight, Gift, Clock } from "lucide-react";
import { Course } from "@/data/courses";

interface OfferCardProps {
    course: Course;
}

/** A free CITech course, shown as an offer */
export function OfferCard({ course }: OfferCardProps) {
    return (
        <Link
            href={`/courses/${course.id}`}
            className="group relative block rounded-2xl overflow-hidden shadow-xl ring-4 ring-amber-300/70 hover:ring-amber-400 transition-all bg-white"
        >
            <div className={`relative h-44 w-full ${course.imageUrl}`}>
                {course.coverImageUrl && (
                    // Covers are redirects to short-lived signed URLs, so they bypass next/image
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={course.coverImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                )}
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold uppercase tracking-wide shadow-lg ring-2 ring-white">
                    <Gift className="h-3.5 w-3.5" />
                    Free Offer
                </span>
            </div>
            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 leading-snug mb-1.5">{course.title}</h3>
                {course.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{course.description}</p>
                )}
                <div className="flex items-center justify-between">
                    <span className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {course.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-medical-green-700 font-bold text-sm group-hover:gap-2.5 transition-all">
                        View Offer <ArrowRight className="h-4 w-4" />
                    </span>
                </div>
            </div>
        </Link>
    );
}

import Link from "next/link";
import { ArrowRight, Gift, Clock } from "lucide-react";
import { Course } from "@/data/courses";
import { CourseCoverImage } from "@/components/CourseCoverImage";

interface OfferCardProps {
    course: Course;
}

/** A free CITech course, shown as an offer */
export function OfferCard({ course }: OfferCardProps) {
    return (
        <Link
            href={`/courses/${course.id}`}
            className="group relative block rounded-2xl overflow-hidden border border-amber-200 bg-white shadow-soft hover:shadow-lift hover:-translate-y-0.5 transition-all"
        >
            {/* 16:9 frame: the cover is shown whole, never cropped */}
            <div className="relative aspect-video w-full">
                <CourseCoverImage
                    src={course.coverImageUrl}
                    alt={`${course.title} cover`}
                    className="absolute inset-0"
                    fallbackClassName={course.imageUrl}
                />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold uppercase tracking-wide shadow-md ring-2 ring-white">
                    <Gift className="h-3.5 w-3.5" />
                    Free Offer
                </span>
            </div>
            <div className="p-5">
                <h3 className="font-display text-lg font-extrabold text-ink-900 leading-snug mb-1.5">{course.title}</h3>
                {course.description && (
                    <p className="text-sm text-ink-600 line-clamp-2 mb-3">{course.description}</p>
                )}
                <div className="flex items-center justify-between">
                    <span className="flex items-center text-xs text-ink-500">
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

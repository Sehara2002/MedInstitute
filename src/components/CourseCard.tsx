import Link from "next/link";
import { Clock, ArrowRight, Video, Star, Flame } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { CourseCoverImage } from "@/components/CourseCoverImage";
import { OfferCountdown } from "@/components/OfferCountdown";
import { Course } from "@/data/courses";
import { bestSaving, cheapestFee, savingPercent } from "@/lib/fees";
import { cn } from "@/lib/utils";

interface CourseCardProps {
    course: Course;
}

/**
 * A course in the catalogue. Featured courses and courses on a limited-time offer get the
 * "bubble" treatment: a coloured ring, soft floating bubbles behind the card, pill badges,
 * a live countdown and the offer price next to the usual one.
 */
export function CourseCard({ course }: CourseCardProps) {
    const fee = cheapestFee(course);
    const onOffer = course.offer !== null;
    const highlighted = onOffer || course.isFeatured;
    const saving = onOffer ? bestSaving(course) : null;
    const feeSaving = fee ? savingPercent(fee) : null;

    return (
        <div className="relative isolate h-full">
            {/* Decorative bubbles behind highlighted cards (isolate keeps them above the page background) */}
            {highlighted && (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                    <span
                        className={cn(
                            "absolute -top-5 -right-4 h-24 w-24 rounded-full blur-2xl",
                            onOffer ? "bg-rose-300/50" : "bg-amber-300/50"
                        )}
                    />
                    <span className="absolute -bottom-6 -left-5 h-28 w-28 rounded-full bg-medical-blue-200/50 blur-2xl" />
                    <span className="absolute top-1/2 -left-3 h-10 w-10 rounded-full bg-medical-green-200/60 blur-xl" />
                </div>
            )}

            <GlassCard
                className={cn(
                    "flex flex-col overflow-visible group h-full relative rounded-[1.75rem]",
                    highlighted && "bg-white/70 hover:-translate-y-1",
                    onOffer && "ring-2 ring-rose-300/70",
                    !onOffer && course.isFeatured && "ring-2 ring-amber-300/80"
                )}
            >
                {/* 16:9 frame: the cover is shown whole, never cropped */}
                <div className="relative aspect-video w-full rounded-t-[1.75rem] overflow-hidden">
                    <CourseCoverImage
                        src={course.coverImageUrl}
                        alt={`${course.title} cover`}
                        className="absolute inset-0"
                        fallbackClassName={course.imageUrl}
                    />

                    {/* Promotion pills, floating over the cover */}
                    {highlighted && (
                        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                            {course.isFeatured && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-950 shadow-md">
                                    <Star className="h-3 w-3 fill-amber-900/80" aria-hidden="true" />
                                    Featured
                                </span>
                            )}
                            {onOffer && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-orange-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
                                    <Flame className="h-3 w-3" aria-hidden="true" />
                                    {course.offer?.label || "Limited offer"}
                                </span>
                            )}
                        </div>
                    )}
                    {onOffer && course.offer && (
                        <OfferCountdown endsAt={course.offer.endsAt} className="absolute bottom-2.5 right-2.5" />
                    )}

                    {/* Saving bubble, in the cover's top-right corner (pills are top-left, countdown bottom-right) */}
                    {saving !== null && (
                        <div
                            className="absolute right-3 top-5 z-20 flex h-14 w-14 rotate-6 flex-col items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-400 text-white shadow-lg ring-4 ring-white motion-safe:animate-float-slow"
                            aria-label={`Save up to ${saving}%`}
                        >
                            <span className="text-[9px] font-semibold uppercase leading-none">{course.fees.length > 1 ? "Up to" : "Save"}</span>
                            <span className="text-base font-black leading-tight">{saving}%</span>
                        </div>
                    )}
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

                <div className="flex flex-col flex-grow p-4 pt-2 rounded-b-[1.75rem] overflow-hidden">
                    <div className="mb-2.5 flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
                        <span className="inline-flex items-center rounded-full bg-medical-blue-50 px-2 py-0.5 text-[10px] font-medium text-medical-blue-700">
                            {course.level}
                        </span>
                        {fee && (
                            <span
                                className={cn(
                                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                                    feeSaving !== null ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200" : "bg-medical-green-50 text-medical-green-700"
                                )}
                            >
                                {feeSaving !== null && fee.originalDisplay && (
                                    <span className="font-normal text-gray-400 line-through">{fee.originalDisplay}</span>
                                )}
                                <span>{course.fees.length > 1 ? `From ${fee.display}` : fee.display}</span>
                            </span>
                        )}
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
                            {course.acceptsOnlinePayment && (
                                <Link
                                    href={`/register?id=${encodeURIComponent(course.id)}`}
                                    className={cn(
                                        "inline-flex items-center text-xs font-semibold text-white px-3 py-1 rounded-full shadow-sm transition-colors",
                                        onOffer
                                            ? "bg-gradient-to-r from-rose-500 to-orange-400 hover:from-rose-600 hover:to-orange-500"
                                            : "bg-medical-green-600 hover:bg-medical-green-500"
                                    )}
                                >
                                    {onOffer ? "Grab Offer" : "Register"}
                                </Link>
                            )}
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
        </div>
    );
}

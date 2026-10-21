import Link from "next/link";
import { Clock, ArrowRight, Video, Star, Flame } from "lucide-react";
import { CourseCoverImage } from "@/components/CourseCoverImage";
import { OfferCountdown } from "@/components/OfferCountdown";
import { Course } from "@/data/courses";
import { bestSaving, cheapestFee, savingPercent } from "@/lib/fees";
import { cn } from "@/lib/utils";

interface CourseCardProps {
    course: Course;
}

/**
 * A course in the catalogue. Featured courses and courses on a limited-time offer get an
 * accent border, pill badges, a live countdown and the offer price next to the usual one.
 */
export function CourseCard({ course }: CourseCardProps) {
    const fee = cheapestFee(course);
    const onOffer = course.offer !== null;
    const highlighted = onOffer || course.isFeatured;
    const saving = onOffer ? bestSaving(course) : null;
    const feeSaving = fee ? savingPercent(fee) : null;

    return (
        <article
            className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
                onOffer ? "border-rose-200" : course.isFeatured ? "border-amber-200" : "border-ink-100"
            )}
        >
            {/* 16:9 frame: the cover is shown whole, never cropped */}
            <div className="relative aspect-video w-full overflow-hidden bg-ink-50">
                <CourseCoverImage
                    src={course.coverImageUrl}
                    alt={`${course.title} cover`}
                    className="absolute inset-0"
                    fallbackClassName={course.imageUrl}
                />

                {/* Promotion pills, floating over the cover */}
                {highlighted && (
                    <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                        {course.isFeatured && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-950 shadow-md">
                                <Star className="h-3 w-3 fill-amber-900/80" aria-hidden="true" />
                                Featured
                            </span>
                        )}
                        {onOffer && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
                                <Flame className="h-3 w-3" aria-hidden="true" />
                                {course.offer?.label || "Limited offer"}
                            </span>
                        )}
                    </div>
                )}
                {onOffer && course.offer && (
                    <OfferCountdown endsAt={course.offer.endsAt} className="absolute bottom-3 right-3" />
                )}

                {/* Saving badge, in the cover's top-right corner (pills are top-left, countdown bottom-right) */}
                {saving !== null && (
                    <div
                        className="absolute right-3 top-3 z-20 flex h-14 w-14 flex-col items-center justify-center rounded-full bg-rose-600 text-white shadow-lg ring-4 ring-white"
                        aria-label={`Save up to ${saving}%`}
                    >
                        <span className="text-[9px] font-semibold uppercase leading-none">{course.fees.length > 1 ? "Up to" : "Save"}</span>
                        <span className="text-base font-black leading-tight">{saving}%</span>
                    </div>
                )}
            </div>

            <div className="flex flex-grow flex-col p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-medical-blue-50 px-2.5 py-1 text-[11px] font-semibold text-medical-blue-700">
                        {course.level}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-medical-green-50 px-2.5 py-1 text-[11px] font-semibold text-medical-green-800">
                        <Video className="h-3 w-3" aria-hidden="true" />
                        Recordings available
                    </span>
                </div>

                <h3 className="font-display text-base font-extrabold leading-snug text-ink-900 transition-colors group-hover:text-medical-green-700">
                    {course.title}
                </h3>
                <p className="mb-4 mt-2 line-clamp-2 flex-grow text-sm leading-relaxed text-ink-600">{course.description}</p>

                {fee && (
                    <div className="mb-4 flex flex-wrap items-baseline gap-x-2">
                        {feeSaving !== null && fee.originalDisplay && (
                            <span className="text-sm text-ink-400 line-through">{fee.originalDisplay}</span>
                        )}
                        <span className={cn("text-xs font-semibold", course.fees.length > 1 ? "text-ink-500" : "hidden")}>From</span>
                        <span className={cn("font-display text-xl font-extrabold", feeSaving !== null ? "text-rose-600" : "text-medical-green-700")}>
                            {fee.display}
                        </span>
                    </div>
                )}

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink-100 pt-4">
                    <span className="flex items-center text-xs font-medium text-ink-500">
                        <Clock className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                        {course.duration}
                    </span>
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/courses/${course.id}`}
                            className="inline-flex items-center text-sm font-semibold text-ink-600 transition-colors hover:text-medical-green-700"
                        >
                            Details <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        </Link>
                        {course.acceptsOnlinePayment && (
                            <Link
                                href={`/register?id=${encodeURIComponent(course.id)}`}
                                className={cn(
                                    "inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors",
                                    onOffer ? "bg-rose-600 hover:bg-rose-700" : "bg-medical-green-600 hover:bg-medical-green-700"
                                )}
                            >
                                {onOffer ? "Grab offer" : "Register"}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}

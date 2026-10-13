import { findCourseContent, parseCourseId, toCourseId } from "@/data/courses";
import { getCourse } from "@/lib/citech";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { Clock, GraduationCap, ArrowLeft, CheckCircle, Download, Video, Gift, ExternalLink, Star, Flame } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { RegisterButton } from "@/components/RegisterButton";
import { OfferCountdown } from "@/components/OfferCountdown";
import { CourseCoverImage } from "@/components/CourseCoverImage";
import { savingPercent } from "@/lib/fees";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function CoursePage({ params }: PageProps) {
    const { id } = await params;

    // Links from before the catalogue moved to CITech use the old course ids
    if (parseCourseId(id) === null) {
        const content = findCourseContent(id);
        redirect(content?.citechCourseId !== undefined ? `/courses/${toCourseId(content.citechCourseId)}` : "/courses");
    }

    const lookup = await getCourse(id);
    if (lookup.status === "not_found") {
        notFound();
    }
    if (lookup.status === "unavailable") {
        return (
            <>
                <Navbar />
                <main className="min-h-screen flex items-center justify-center py-16 px-4">
                    <GlassCard className="p-10 text-center max-w-xl" variant="panel">
                        <p className="text-gray-900 font-semibold mb-2">This course is temporarily unavailable</p>
                        <p className="text-sm text-gray-600 mb-6">Please try again in a few minutes.</p>
                        <Link
                            href="/courses"
                            className="inline-block px-6 py-2.5 rounded-xl bg-medical-green-600 text-white font-semibold hover:bg-medical-green-500 transition-colors"
                        >
                            Back to Courses
                        </Link>
                    </GlassCard>
                </main>
                <Footer />
            </>
        );
    }

    const course = lookup.course;

    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                {/* Course Header */}
                <div className={`relative overflow-hidden py-24 ${course.imageUrl}`}>
                    {course.coverImageUrl && (
                        // Decorative blurred backdrop only; the full cover is shown uncropped below.
                        // Covers are redirects to short-lived signed URLs, so they bypass next/image
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={course.coverImageUrl}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl"
                        />
                    )}
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <Link
                            href="/courses"
                            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-medical-green-700 mb-6 bg-white/50 backdrop-blur rounded-lg px-3 py-1 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Courses
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{course.title}</h1>
                        <div className="flex flex-wrap gap-4">
                            {course.isFree && (
                                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-3 py-1 text-sm font-bold text-white shadow-sm">
                                    <Gift className="h-4 w-4 mr-2" />
                                    Free Offer
                                </span>
                            )}
                            {course.isFeatured && (
                                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-3 py-1 text-sm font-bold text-amber-950 shadow-sm">
                                    <Star className="h-4 w-4 mr-2 fill-amber-900/80" aria-hidden="true" />
                                    Featured
                                </span>
                            )}
                            {course.offer && (
                                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-rose-500 to-orange-400 px-3 py-1 text-sm font-bold text-white shadow-sm">
                                    <Flame className="h-4 w-4 mr-2" aria-hidden="true" />
                                    {course.offer.label || "Limited-Time Offer"}
                                </span>
                            )}
                            <span className="inline-flex items-center rounded-full bg-white/60 px-3 py-1 text-sm font-medium text-gray-800 shadow-sm">
                                <GraduationCap className="h-4 w-4 mr-2 text-medical-green-600" />
                                {course.level}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-white/60 px-3 py-1 text-sm font-medium text-gray-800 shadow-sm">
                                <Clock className="h-4 w-4 mr-2 text-medical-blue-600" />
                                {course.duration}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-medical-green-600 px-3 py-1 text-sm font-bold text-white shadow-sm">
                                <Video className="h-4 w-4 mr-2" />
                                Recordings Available
                            </span>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {course.coverImageUrl && (
                                <CourseCoverImage
                                    src={course.coverImageUrl}
                                    alt={`${course.title} cover`}
                                    eager
                                    className="w-full aspect-video rounded-[1.75rem] shadow-lg ring-1 ring-white/60"
                                    fallbackClassName={course.imageUrl}
                                />
                            )}
                            <GlassCard className="p-8" variant="panel">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Program Overview</h2>
                                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                                    {course.description}
                                </p>
                                {course.instructor && (
                                    <p className="mt-4 text-gray-700">
                                        <span className="font-semibold text-gray-900">Instructor:</span> {course.instructor}
                                    </p>
                                )}
                                {/* Display Mode of Delivery if available */}
                                {course.mode.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Mode of Delivery</h3>
                                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                            {course.mode.map((m, i) => (
                                                <li key={i}>{m}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {/* Display Target Audience if available */}
                                {course.targetAudience.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Who Can Apply</h3>
                                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                            {course.targetAudience.map((aud, i) => (
                                                <li key={i}>{aud}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </GlassCard>

                            {course.curriculum.length > 0 && (
                                <GlassCard className="p-8" variant="panel">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Curriculum</h2>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {course.curriculum.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <CheckCircle className="h-5 w-5 text-medical-green-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700 uppercase">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </GlassCard>
                            )}


                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <GlassCard className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Course Details</h3>
                                {course.offer && (
                                    <div className="relative isolate mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 via-white to-amber-50 p-4 ring-1 ring-rose-200">
                                        <span aria-hidden="true" className="absolute -top-6 -right-6 -z-10 h-20 w-20 rounded-full bg-rose-200/60 blur-xl" />
                                        <p className="flex items-center gap-1.5 text-sm font-bold text-rose-700">
                                            <Flame className="h-4 w-4" aria-hidden="true" />
                                            {course.offer.label || "Limited-time offer"}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-600">
                                            Start your payment before the offer ends to keep the offer price.
                                        </p>
                                        <OfferCountdown endsAt={course.offer.endsAt} className="mt-2.5" />
                                    </div>
                                )}
                                <div className="space-y-4 mb-6">
                                    <div className="text-sm">
                                        <span className="text-gray-500 block mb-1">Course Fee</span>
                                        {course.isFree ? (
                                            <span className="font-bold text-medical-green-700">Free</span>
                                        ) : course.fees.length > 0 ? (
                                            <div className="space-y-1.5 mt-1">
                                                {course.fees.map((fee) => {
                                                    const saving = savingPercent(fee);
                                                    return (
                                                        <div
                                                            key={fee.key}
                                                            className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 ${
                                                                saving !== null ? "bg-rose-50/80 ring-1 ring-rose-100" : "bg-white/60"
                                                            }`}
                                                        >
                                                            <span className="text-sm font-medium text-gray-700">
                                                                {course.fees.length > 1 ? fee.label : "Tuition"}
                                                            </span>
                                                            <span className="flex items-center gap-2 text-right">
                                                                {saving !== null && fee.originalDisplay && (
                                                                    <span className="text-xs text-gray-400 line-through">{fee.originalDisplay}</span>
                                                                )}
                                                                <span className={`font-bold ${saving !== null ? "text-rose-600" : "text-gray-900"}`}>
                                                                    {fee.display}
                                                                </span>
                                                                {saving !== null && (
                                                                    <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                                                        -{saving}%
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <span className="font-medium text-gray-900">Contact for details</span>
                                        )}
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-gray-500 block">Duration</span>
                                        <span className="font-medium text-gray-900">{course.duration}</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-gray-500 block">Level</span>
                                        <span className="font-medium text-gray-900">{course.level}</span>
                                    </div>
                                </div>
                                {course.isFree ? (
                                    course.lmsUrl && (
                                        <a
                                            href={course.lmsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full text-center py-3 rounded-xl bg-medical-green-600 text-white font-semibold shadow-lg hover:bg-medical-green-500 transition-colors"
                                        >
                                            Join for Free <ExternalLink className="h-4 w-4" />
                                        </a>
                                    )
                                ) : course.acceptsOnlinePayment ? (
                                    <RegisterButton
                                        courseId={course.id}
                                        requiresAccount={course.requiresAccount}
                                        courseTitle={course.title}
                                    />
                                ) : (
                                    <Link
                                        href="/contact"
                                        className="block w-full text-center py-3 rounded-xl bg-medical-green-600 text-white font-semibold shadow-lg hover:bg-medical-green-500 transition-colors"
                                    >
                                        Contact Us to Enroll
                                    </Link>
                                )}
                                {course.brochures.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        {course.brochures.map((brochure, i) => (
                                            <a
                                                key={i}
                                                href={brochure.url}
                                                download
                                                className="flex items-center justify-center gap-2 w-full text-center py-3 rounded-xl bg-white border-2 border-medical-green-600 text-medical-green-700 font-semibold hover:bg-medical-green-50 transition-colors"
                                            >
                                                <Download className="h-5 w-5" />
                                                Download {brochure.label}
                                            </a>
                                        ))}
                                    </div>
                                )}

                                {course.acceptsOnlinePayment && (
                                    <div className="pt-6 mt-6 border-t border-gray-200 text-center">
                                        <p className="text-xs text-gray-500 font-medium mb-3">We&apos;re powered with</p>
                                        <div className="flex items-center justify-center gap-4 flex-wrap">
                                            <Image src="/images/combanklogo2.png" alt="Commercial Bank" width={110} height={28} className="object-contain" />
                                            <Image src="/images/visalogo.png" alt="Visa" width={48} height={28} className="object-contain" />
                                            <Image src="/images/mastercardlogo.png" alt="Mastercard" width={48} height={28} className="object-contain" />
                                        </div>
                                    </div>
                                )}
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

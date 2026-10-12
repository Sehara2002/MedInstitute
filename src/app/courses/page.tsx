import Link from "next/link";
import { Gift, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CourseCard } from "@/components/CourseCard";
import { OfferCard } from "@/components/OfferCard";
import { GlassCard } from "@/components/GlassCard";
import { listCourses } from "@/lib/citech";
import { isHighlighted } from "@/lib/fees";

// Rendered on every visit so courses added or changed in the LMS appear at once
// (and a build that cannot reach CITech never freezes the page as static)
export const dynamic = "force-dynamic";

export default async function CoursesPage() {
    const courses = await listCourses();
    const offers = courses?.filter((c) => c.isFree) ?? [];
    // Featured courses and running limited-time offers get their own band; the catalogue
    // already lists featured courses first. Offers first within the band, as they expire.
    const highlighted = (courses?.filter(isHighlighted) ?? []).sort(
        (a, b) => Number(b.offer !== null) - Number(a.offer !== null)
    );
    const paidCourses = courses?.filter((c) => !c.isFree && !isHighlighted(c)) ?? [];

    return (
        <>
            <Navbar />
            <main className="min-h-screen py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Programs</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Explore our range of accredited medical and healthcare courses designed to launch your career.
                        </p>
                    </div>

                    {courses === null ? (
                        <GlassCard className="p-10 text-center max-w-2xl mx-auto" variant="panel">
                            <p className="text-gray-900 font-semibold mb-2">Our course list is temporarily unavailable</p>
                            <p className="text-sm text-gray-600 mb-6">Please try again in a few minutes, or contact us and we&apos;ll help you enroll.</p>
                            <Link
                                href="/contact"
                                className="inline-block px-6 py-2.5 rounded-xl bg-medical-green-600 text-white font-semibold hover:bg-medical-green-500 transition-colors"
                            >
                                Contact Us
                            </Link>
                        </GlassCard>
                    ) : (
                        <>
                        {highlighted.length > 0 && (
                            <section aria-labelledby="highlighted-heading" className="relative isolate mb-14">
                                {/* Soft bubble backdrop for the band */}
                                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[2.5rem]">
                                    <span className="absolute -top-10 left-10 h-48 w-48 rounded-full bg-rose-200/50 blur-3xl" />
                                    <span className="absolute -bottom-12 right-16 h-56 w-56 rounded-full bg-amber-200/50 blur-3xl" />
                                    <span className="absolute top-1/3 right-1/3 h-32 w-32 rounded-full bg-medical-green-200/40 blur-3xl" />
                                </div>
                                <div className="rounded-[2.5rem] border border-white/60 bg-white/30 p-6 sm:p-8 backdrop-blur-sm">
                                    <h2 id="highlighted-heading" className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-1">
                                        <Sparkles className="h-5 w-5 text-amber-500" aria-hidden="true" />
                                        Featured &amp; Limited-Time Offers
                                    </h2>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Hand-picked programmes and special prices. Offer prices apply when you start your payment before the offer ends.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {highlighted.map((course) => (
                                            <CourseCard key={course.id} course={course} />
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}
                        <div className={`grid grid-cols-1 gap-10 items-start ${offers.length > 0 ? "lg:grid-cols-[400px_minmax(0,1fr)]" : ""}`}>
                            {/* Offers — free courses from the LMS, sticky on desktop, newest first */}
                            {offers.length > 0 && (
                                <div className="lg:sticky lg:top-24 space-y-6">
                                    <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                                        <Gift className="h-5 w-5 text-red-500" />
                                        Free Courses
                                    </h2>
                                    {offers.map((offer) => (
                                        <OfferCard key={offer.id} course={offer} />
                                    ))}
                                </div>
                            )}

                            {/* Regular course grid */}
                            {paidCourses.length > 0 ? (
                                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${offers.length > 0 ? "" : "lg:grid-cols-3"}`}>
                                    {paidCourses.map((course) => (
                                        <CourseCard key={course.id} course={course} />
                                    ))}
                                </div>
                            ) : highlighted.length === 0 ? (
                                <p className="text-center text-gray-600">New courses are coming soon.</p>
                            ) : null}
                        </div>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}

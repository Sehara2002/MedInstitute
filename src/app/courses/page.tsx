import Link from "next/link";
import { Gift } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CourseCard } from "@/components/CourseCard";
import { CourseHighlightSection } from "@/components/CourseHighlightSection";
import { OfferCard } from "@/components/OfferCard";
import { GlassCard } from "@/components/GlassCard";
import { listCourses } from "@/lib/citech";

// Rendered on every visit so courses added or changed in the LMS appear at once
// (and a build that cannot reach CITech never freezes the page as static)
export const dynamic = "force-dynamic";

export default async function CoursesPage() {
    const courses = await listCourses();
    const offers = courses?.filter((c) => c.isFree) ?? [];
    // Limited-time offers and featured courses are separate promotions with separate bands.
    // A course that is both is shown once, under offers (the offer runs out), still wearing
    // its Featured pill. Offers ending soonest come first.
    const paid = courses?.filter((c) => !c.isFree) ?? [];
    const offerCourses = paid
        .filter((c) => c.offer !== null)
        .sort((a, b) => Date.parse(a.offer!.endsAt) - Date.parse(b.offer!.endsAt));
    const featuredCourses = paid.filter((c) => c.isFeatured && c.offer === null);
    const paidCourses = paid.filter((c) => !c.isFeatured && c.offer === null);
    const highlightedCount = offerCourses.length + featuredCourses.length;

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
                        <CourseHighlightSection kind="offers" courses={offerCourses} />
                        <CourseHighlightSection kind="featured" courses={featuredCourses} />
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
                            ) : highlightedCount === 0 ? (
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

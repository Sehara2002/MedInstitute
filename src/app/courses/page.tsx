import Link from "next/link";
import { Gift } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CourseCard } from "@/components/CourseCard";
import { CourseHighlightSection } from "@/components/CourseHighlightSection";
import { OfferCard } from "@/components/OfferCard";
import { PageHeader } from "@/components/PageHeader";
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
            <main className="min-h-screen">
                <PageHeader
                    eyebrow="Courses"
                    title="Our programmes"
                    description="Explore our range of medical and healthcare courses designed to launch your career."
                />
                <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">

                    {courses === null ? (
                        <div className="mx-auto max-w-2xl rounded-2xl border border-ink-100 bg-white p-10 text-center shadow-soft">
                            <p className="font-display text-lg font-extrabold text-ink-900 mb-2">Our course list is temporarily unavailable</p>
                            <p className="text-sm text-ink-600 mb-6">Please try again in a few minutes, or contact us and we&apos;ll help you enroll.</p>
                            <Link
                                href="/contact"
                                className="btn-primary"
                            >
                                Contact Us
                            </Link>
                        </div>
                    ) : (
                        <>
                        <CourseHighlightSection kind="offers" courses={offerCourses} />
                        <CourseHighlightSection kind="featured" courses={featuredCourses} />
                        <div className={`grid grid-cols-1 gap-10 items-start ${offers.length > 0 ? "lg:grid-cols-[400px_minmax(0,1fr)]" : ""}`}>
                            {/* Offers — free courses from the LMS, sticky on desktop, newest first */}
                            {offers.length > 0 && (
                                <div className="lg:sticky lg:top-24 space-y-6">
                                    <h2 className="flex items-center gap-2 font-display text-xl font-extrabold text-ink-900">
                                        <Gift className="h-5 w-5 text-rose-500" />
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
                                <p className="text-center text-ink-600">New courses are coming soon.</p>
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

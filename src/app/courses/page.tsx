import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CourseCard } from "@/components/CourseCard";
import { courses } from "@/data/courses";

export default function CoursesPage() {
    const featuredCourses = courses.filter((c) => c.featured);
    const regularCourses = courses.filter((c) => !c.featured);

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

                    <div className="grid grid-cols-1 lg:grid-cols-[460px_minmax(0,1fr)] gap-10 items-start">
                        {/* Featured flyers — stacked, sticky on desktop, most urgent first */}
                        {featuredCourses.length > 0 && (
                            <div className="lg:sticky lg:top-24 space-y-8">
                                {featuredCourses.map((fc) => (
                                    <div key={fc.id} className="relative animate-float-slow">
                                        {/* Urgent pulsing ring, or standard golden glow */}
                                        <div
                                            className={`absolute -inset-3 rounded-3xl blur-2xl opacity-80 ${
                                                fc.urgent
                                                    ? "bg-gradient-to-br from-red-400/50 via-orange-400/40 to-red-500/50 animate-pulse"
                                                    : "bg-gradient-to-br from-amber-300/50 via-yellow-300/40 to-amber-400/50"
                                            }`}
                                        />

                                        {fc.urgent && (
                                            <div className="absolute -top-3 -right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold shadow-lg ring-2 ring-white animate-pulse">
                                                <Zap className="h-3.5 w-3.5" />
                                                Urgent — Tomorrow
                                            </div>
                                        )}

                                        <Link
                                            href={`/courses/${fc.id}`}
                                            className={`group relative block rounded-2xl overflow-hidden shadow-2xl ring-4 transition-all ${
                                                fc.urgent
                                                    ? "ring-red-300/70 hover:ring-red-400"
                                                    : "ring-amber-300/70 hover:ring-amber-400"
                                            }`}
                                        >
                                            <Image
                                                src={fc.flyerImage || ""}
                                                alt={fc.title}
                                                width={809}
                                                height={1280}
                                                className="w-full h-auto object-cover"
                                                priority
                                            />
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 pt-14">
                                                <span className="inline-flex items-center gap-1.5 text-white font-bold text-base group-hover:gap-2.5 transition-all">
                                                    View Details <ArrowRight className="h-5 w-5" />
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Regular course grid — smaller, secondary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {regularCourses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
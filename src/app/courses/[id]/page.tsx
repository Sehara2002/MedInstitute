import { courses } from "@/data/courses";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { Clock, GraduationCap, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// For SSG, we can generate static params
export async function generateStaticParams() {
    return courses.map((course) => ({
        id: course.id,
    }));
}

interface PageProps {
    params: {
        id: string;
    };
}

export default async function CoursePage({ params }: PageProps) {
    // Await params because in Next.js 15+ params is a Promise
    const { id } = await params;
    const course = courses.find((c) => c.id === id);

    if (!course) {
        notFound();
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                {/* Course Header */}
                <div className={`relative py-24 ${course.imageUrl}`}>
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
                            <span className="inline-flex items-center rounded-full bg-white/60 px-3 py-1 text-sm font-medium text-gray-800 shadow-sm">
                                <GraduationCap className="h-4 w-4 mr-2 text-medical-green-600" />
                                {course.level}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-white/60 px-3 py-1 text-sm font-medium text-gray-800 shadow-sm">
                                <Clock className="h-4 w-4 mr-2 text-medical-blue-600" />
                                {course.duration}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <GlassCard className="p-8" variant="panel">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Program Overview</h2>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {course.description}
                                </p>
                                {/* Display Mode of Delivery if available */}
                                {course.mode && (
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
                                {course.targetAudience && (
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

                            {course.curriculum && (
                                <GlassCard className="p-8" variant="panel">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Curriculum</h2>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {course.curriculum.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <CheckCircle className="h-5 w-5 text-medical-green-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">{item}</span>
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
                                <div className="space-y-4 mb-6">
                                    <div className="text-sm">
                                        <span className="text-gray-500 block">Course Fee</span>
                                        <span className="font-medium text-gray-900">{course.fee || "Contact for details"}</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-gray-500 block">Duration/Mode</span>
                                        <span className="font-medium text-gray-900">{course.duration}</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-gray-500 block">Level</span>
                                        <span className="font-medium text-gray-900">{course.level}</span>
                                    </div>
                                </div>
                                <Link
                                    href="/contact#contact-details"
                                    className="block w-full text-center py-3 rounded-xl bg-medical-green-600 text-white font-semibold shadow-lg hover:bg-medical-green-500 transition-colors"
                                >
                                    Contact to Register
                                </Link>
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

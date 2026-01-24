import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { Microscope, Dna, FileText } from "lucide-react";

export default function ResearchPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Research at Family Medicine Forum</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Pioneering discoveries that shape the future of medicine and healthcare.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {/* Featured Research */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Projects</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <GlassCard className="p-8" variant="panel">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-lg bg-medical-green-100/50 text-medical-green-700">
                                            <Dna className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Genomic Medicine</h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        Investigating the genetic basis of rare diseases to develop targeted therapies.
                                        Our team is mapping specific gene markers to improve early diagnosis.
                                    </p>
                                    <span className="text-sm font-medium text-medical-green-600">Ongoing • Started 2024</span>
                                </GlassCard>

                                <GlassCard className="p-8" variant="panel">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-lg bg-medical-blue-100/50 text-medical-blue-700">
                                            <Microscope className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Advanced Immunology</h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        Developing new protocols for autoimmune disorder management through
                                        innovative immunotherapy techniques.
                                    </p>
                                    <span className="text-sm font-medium text-medical-blue-600">Published • 2025</span>
                                </GlassCard>
                            </div>
                        </section>

                        {/* Recent Publications */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Publications</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {[1, 2, 3].map((i) => (
                                    <GlassCard key={i} className="p-6 flex items-start gap-4">
                                        <FileText className="h-6 w-6 text-gray-500 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 hover:text-medical-green-600 cursor-pointer transition-colors">
                                                Impact of Telemedicine on Rural Healthcare Access in 2025
                                            </h4>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Journal of Modern Medicine • Vol 4{i}, Issue {i} • Authors: Dr. Smith, Dr. Doe
                                            </p>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Mail, Linkedin, ArrowLeft, GraduationCap, Award, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { staff } from '@/data/staff';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

// Generate static params for all staff members
export function generateStaticParams() {
    return staff.map((member) => ({
        id: member.id,
    }));
}

export default async function StaffDetailsPage({ params }: PageProps) {
    const resolvedParams = await params;
    const member = staff.find((s) => s.id === resolvedParams.id);

    if (!member) {
        notFound();
    }

    // Resolving logic for image vs gradient
    const renderImage = () => {
        if (typeof member.image === 'string' && member.image.startsWith('bg-')) {
            return (
                <div className={`w-full h-full ${member.image} flex items-center justify-center text-6xl font-bold text-white`}>
                    {member.name.charAt(0)}
                </div>
            );
        } else if (member.image) {
            return (
                <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                />
            );
        }
        return (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-6xl font-bold text-gray-400">
                {member.name.charAt(0)}
            </div>
        );
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/staff"
                        className="inline-flex items-center text-medical-green-700 font-medium mb-8 hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Faculty
                    </Link>

                    <GlassCard className="overflow-hidden">
                        <div className="md:flex">
                            {/* Image Section */}
                            <div className="md:w-1/3 relative h-80 md:h-auto min-h-[320px]">
                                {renderImage()}
                            </div>

                            {/* Content Section */}
                            <div className="md:w-2/3 p-8 lg:p-12">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{member.name}</h1>
                                <p className="text-xl text-medical-green-600 font-semibold mb-6">{member.role}</p>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-3">
                                        <GraduationCap className="h-6 w-6 text-medical-blue-600 mt-1 shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Qualifications</h3>
                                            <p className="text-gray-600">{member.qualification}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Briefcase className="h-6 w-6 text-medical-green-600 mt-1 shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Working</h3>
                                            <p className="text-gray-600">{member.working}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Award className="h-6 w-6 text-purple-600 mt-1 shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Expertise</h3>
                                            <p className="text-gray-600">{member.bio}</p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100 flex gap-4">
                                        {member.email && (
                                            <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-gray-600 hover:text-medical-green-600 transition-colors">
                                                <div className="p-2 rounded-full bg-gray-100">
                                                    <Mail className="h-4 w-4" />
                                                </div>
                                                <span className="text-sm font-medium">Contact</span>
                                            </a>
                                        )}
                                        {member.linkedin && (
                                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-medical-blue-600 transition-colors">
                                                <div className="p-2 rounded-full bg-gray-100">
                                                    <Linkedin className="h-4 w-4" />
                                                </div>
                                                <span className="text-sm font-medium">LinkedIn</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </main>
            <Footer />
        </>
    );
}

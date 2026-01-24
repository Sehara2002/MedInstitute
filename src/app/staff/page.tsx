import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { Mail, Linkedin, ArrowRight } from "lucide-react";
import { staff } from "@/data/staff";

export default function StaffPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Faculty & Staff</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Meet the dedicated professionals committed to your educational success.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {staff.map((member) => (
                            <GlassCard key={member.id} className="p-6 text-center group flex flex-col h-full" variant="default">
                                <Link href={`/staff/${member.id}`} className="block">
                                    <div className="w-32 h-32 mx-auto rounded-full mb-4 overflow-hidden relative shadow-inner">
                                        {typeof member.image === 'string' && member.image.startsWith('bg-') ? (
                                            <div className={`w-full h-full ${member.image} flex items-center justify-center text-2xl font-bold text-white`}>
                                                {member.name.charAt(0)}
                                            </div>
                                        ) : member.image ? (
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-400">
                                                {member.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-medical-green-600 transition-colors">{member.name}</h3>
                                </Link>

                                <p className="text-gray-600 text-sm mb-2 font-medium">
                                    {member.qualification}
                                </p>
                                <p className="text-medical-green-600 font-semibold text-sm mb-4">{member.role}</p>

                                <div className="mt-auto flex justify-center gap-3">
                                    <Link href={`/staff/${member.id}`} className="inline-flex items-center text-sm font-semibold text-medical-blue-600 hover:text-medical-blue-700 transition-colors">
                                        View Profile <ArrowRight className="ml-1 h-3 w-3" />
                                    </Link>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

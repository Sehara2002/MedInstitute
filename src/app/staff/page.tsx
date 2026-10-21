import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Mail, Linkedin, ArrowRight } from "lucide-react";
import { staff } from "@/data/staff";

export default function StaffPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                <PageHeader
                    eyebrow="Faculty"
                    title="Our faculty & staff"
                    description="Meet the dedicated professionals committed to your educational success."
                />
                <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {staff.map((member) => (
                            <article key={member.id} className="group flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-6 text-center shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                                <Link href={`/staff/${member.id}`} className="block">
                                    <div className="w-32 h-32 mx-auto rounded-full mb-4 overflow-hidden relative ring-4 ring-medical-green-50">
                                        {typeof member.image === 'string' && member.image.startsWith('bg-') ? (
                                            <div className={`w-full h-full ${member.image} flex items-center justify-center text-2xl font-bold text-white`}>
                                                {member.name.charAt(0)}
                                            </div>
                                        ) : member.image ? (
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                sizes="128px"
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-ink-100 flex items-center justify-center text-2xl font-bold text-ink-400">
                                                {member.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-display text-lg font-extrabold text-ink-900 mb-1 group-hover:text-medical-green-700 transition-colors">{member.name}</h3>
                                </Link>

                                <p className="text-ink-600 text-sm mb-2 font-medium">
                                    {member.qualification}
                                </p>
                                <p className="text-medical-green-700 font-semibold text-sm mb-4">{member.role}</p>

                                <div className="mt-auto flex justify-center gap-3">
                                    <Link href={`/staff/${member.id}`} className="inline-flex items-center text-sm font-semibold text-medical-green-700 hover:text-medical-green-800 transition-colors">
                                        View Profile <ArrowRight className="ml-1 h-3 w-3" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

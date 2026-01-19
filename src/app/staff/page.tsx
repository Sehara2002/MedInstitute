import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { Mail, Linkedin } from "lucide-react";

const staff = [
    {
        id: 1,
        name: "Dr. Sarah Johnson",
        role: "Dean of Medicine",
        bio: "Over 20 years of experience in clinical practice and medical education.",
        image: "bg-gradient-to-br from-green-100 to-green-200",
    },
    {
        id: 2,
        name: "Prof. Michael Chen",
        role: "Head of Research",
        bio: "Leading expert in immunology with numerous cited publications.",
        image: "bg-gradient-to-br from-blue-100 to-blue-200",
    },
    {
        id: 3,
        name: "Dr. Emily Davis",
        role: "Senior Lecturer",
        bio: "Specializes in pediatric care and innovative teaching methodologies.",
        image: "bg-gradient-to-br from-purple-100 to-purple-200",
    },
    {
        id: 4,
        name: "James Wilson",
        role: "Lab Director",
        bio: "Oversees all laboratory operations and student safety training.",
        image: "bg-gradient-to-br from-orange-100 to-orange-200",
    },
];

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
                            <GlassCard key={member.id} className="p-6 text-center group" variant="default">
                                <div className={`w-32 h-32 mx-auto rounded-full mb-4 ${member.image} flex items-center justify-center text-2xl font-bold text-white shadow-inner`}>
                                    {member.name.charAt(0)}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                                <p className="text-medical-green-600 font-medium text-sm mb-3">{member.role}</p>
                                <p className="text-gray-600 text-sm mb-4">
                                    {member.bio}
                                </p>
                                <div className="flex justify-center gap-3">
                                    <button className="p-2 rounded-full bg-gray-100 hover:bg-medical-green-100 hover:text-medical-green-600 transition-colors">
                                        <Mail className="h-4 w-4" />
                                    </button>
                                    <button className="p-2 rounded-full bg-gray-100 hover:bg-medical-blue-100 hover:text-medical-blue-600 transition-colors">
                                        <Linkedin className="h-4 w-4" />
                                    </button>
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

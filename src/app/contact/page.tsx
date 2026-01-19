import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
                        <p className="text-xl text-gray-600">
                            Get in touch with our admissions office or visit our campus.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Contact Info */}
                        <GlassCard className="p-8" variant="panel">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-medical-green-100/50 text-medical-green-700">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Address</h3>
                                        <p className="text-gray-600">123 Health Avenue<br />Medical City, MC 10293</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-medical-blue-100/50 text-medical-blue-700">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Phone</h3>
                                        <p className="text-gray-600">+1 (234) 567-890</p>
                                        <p className="text-gray-500 text-sm">Mon-Fri 8am to 6pm</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-purple-100/50 text-purple-700">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Email</h3>
                                        <p className="text-gray-600">admissions@medinstitute.edu</p>
                                        <p className="text-gray-600">info@medinstitute.edu</p>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>

                        {/* Office Hours / Map Placeholder */}
                        <GlassCard className="p-8 h-full flex flex-col justify-between" variant="panel">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Office Hours</h2>
                                <ul className="space-y-4">
                                    <li className="flex justify-between items-center text-gray-600 border-b border-gray-100 pb-2">
                                        <span>Monday - Friday</span>
                                        <span className="font-medium">8:00 AM - 6:00 PM</span>
                                    </li>
                                    <li className="flex justify-between items-center text-gray-600 border-b border-gray-100 pb-2">
                                        <span>Saturday</span>
                                        <span className="font-medium">9:00 AM - 1:00 PM</span>
                                    </li>
                                    <li className="flex justify-between items-center text-gray-600 pb-2">
                                        <span>Sunday</span>
                                        <span className="text-red-500 font-medium">Closed</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-8 rounded-xl overflow-hidden bg-gray-200 h-48 flex items-center justify-center">
                                <span className="text-gray-500 font-medium">Google Maps Integration</span>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="mt-20 border-t border-white/20 bg-white/40 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Family Medicine Forum</h3>
                        <p className="text-gray-600">
                            Excellence in medical education and healthcare training.
                            Building the next generation of healthcare professionals.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start text-gray-600 gap-2">
                                <MapPin className="h-4 w-4 text-medical-green-600 mt-1 flex-shrink-0" />
                                <span>29 C, Perera Avenue,<br />Kohuwala, Nugegoda,<br />Sri Lanka</span>
                            </li>
                            <li className="flex items-center text-gray-600 gap-2">
                                <Phone className="h-4 w-4 text-medical-green-600" />
                                +94 71 873 9060
                            </li>
                            <li className="flex items-center text-gray-600 gap-2">
                                <Mail className="h-4 w-4 text-medical-green-600" />
                                mrcgpinternationalosce@gmail.com
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li><a href="/" className="hover:text-medical-green-600 transition-colors">Home</a></li>
                            <li><a href="/courses" className="hover:text-medical-green-600 transition-colors">Courses</a></li>
                            {/* <li><a href="/research" className="hover:text-medical-green-600 transition-colors">Research</a></li> */}
                            <li><a href="/staff" className="hover:text-medical-green-600 transition-colors">Staff</a></li>
                            <li><a href="/contact" className="hover:text-medical-green-600 transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} Family Medicine Forum. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

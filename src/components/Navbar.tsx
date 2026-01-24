"use client";

import Link from "next/link";
import { Stethoscope, Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/courses", label: "Courses" },
        { href: "/testimonials", label: "Testimonials" },
        { href: "/staff", label: "Staff" },
        { href: "/contact", label: "Contact" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/60 backdrop-blur-xl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="rounded-full bg-medical-green-500/20 p-2">
                            <Stethoscope className="h-6 w-6 text-medical-green-600" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            Family Medicine <span className="text-medical-green-600">Forum</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                                    pathname === link.href
                                        ? "bg-medical-green-100/80 text-medical-green-700 shadow-sm ring-1 ring-medical-green-200"
                                        : "text-gray-700 hover:text-medical-green-600 hover:bg-white/50"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="https://lms.mrcgpfasttrack.com"
                            className="ml-2 px-5 py-2 rounded-full bg-gradient-to-r from-medical-green-600 to-medical-blue-600 text-white text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out relative group overflow-hidden"
                        >
                            <span className="relative z-10">LMS Portal</span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-700 hover:text-medical-green-600"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-white/20 animate-in slide-in-from-top-2">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "text-sm font-medium px-4 py-3 rounded-xl transition-colors",
                                        pathname === link.href
                                            ? "bg-medical-green-100/80 text-medical-green-700"
                                            : "text-gray-700 hover:text-medical-green-600 hover:bg-white/40"
                                    )}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href="#"
                                className="mt-2 text-center text-sm font-bold text-white bg-gradient-to-r from-medical-green-600 to-medical-blue-600 px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                                onClick={() => setIsOpen(false)}
                            >
                                Access LMS Portal
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}


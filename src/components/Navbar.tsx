"use client";

import Link from "next/link";
import { Stethoscope, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/60 backdrop-blur-xl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="rounded-full bg-medical-green-500/20 p-2">
                            <Stethoscope className="h-6 w-6 text-medical-green-600" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            Med<span className="text-medical-green-600">Institute</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex gap-6">
                        <Link
                            href="/"
                            className="text-sm font-medium text-gray-700 hover:text-medical-green-600 transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/courses"
                            className="text-sm font-medium text-gray-700 hover:text-medical-green-600 transition-colors"
                        >
                            Courses
                        </Link>
                        <Link
                            href="/research"
                            className="text-sm font-medium text-gray-700 hover:text-medical-green-600 transition-colors"
                        >
                            Research
                        </Link>
                        <Link
                            href="/staff"
                            className="text-sm font-medium text-gray-700 hover:text-medical-green-600 transition-colors"
                        >
                            Staff
                        </Link>
                        <Link
                            href="/contact"
                            className="text-sm font-medium text-gray-700 hover:text-medical-green-600 transition-colors"
                        >
                            Contact
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
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/"
                                className="text-sm font-medium text-gray-700 hover:text-medical-green-600 transition-colors px-2 py-1 hover:bg-white/40 rounded-lg"
                                onClick={() => setIsOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/courses"
                                className="text-sm font-medium text-gray-700 hover:text-medical-green-600 transition-colors px-2 py-1 hover:bg-white/40 rounded-lg"
                                onClick={() => setIsOpen(false)}
                            >
                                Courses
                            </Link>
                            <Link
                                href="/research"
                                className="text-sm font-medium text-gray-700 hover:text-medical-green-600 transition-colors px-2 py-1 hover:bg-white/40 rounded-lg"
                                onClick={() => setIsOpen(false)}
                            >
                                Research
                            </Link>
                            <Link
                                href="/staff"
                                className="text-sm font-medium text-gray-700 hover:text-medical-green-600 transition-colors px-2 py-1 hover:bg-white/40 rounded-lg"
                                onClick={() => setIsOpen(false)}
                            >
                                Staff
                            </Link>
                            <Link
                                href="/contact"
                                className="text-sm font-medium text-gray-700 hover:text-medical-green-600 transition-colors px-2 py-1 hover:bg-white/40 rounded-lg"
                                onClick={() => setIsOpen(false)}
                            >
                                Contact
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

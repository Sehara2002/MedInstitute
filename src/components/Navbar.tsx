"use client";

import Link from "next/link";
import { Stethoscope, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import Logo from "@/app/logo.png";
import Image from "next/image";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const pathname = usePathname();
    const { data: session, status } = useSession();

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/courses", label: "Courses" },
        { href: "/exams", label: "Exams" },
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
                            <Image src={Logo} alt="Logo" className="h-6 w-6 text-medical-green-600" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            MRCGP <span className="text-medical-green-600">Fast Track</span>
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

                        {/* Auth section */}
                        {status === "loading" ? (
                            <div className="ml-2 h-9 w-24 rounded-full bg-gray-200 animate-pulse" />
                        ) : session?.user ? (
                            <div className="relative ml-2">
                                <button
                                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                                    className="flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-white/70 hover:bg-white transition-colors shadow-sm ring-1 ring-gray-200"
                                >
                                    {session.user.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt={session.user.name || "Student"}
                                            width={28}
                                            height={28}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="h-7 w-7 rounded-full bg-medical-green-100 flex items-center justify-center">
                                            <User className="h-4 w-4 text-medical-green-700" />
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-gray-800 max-w-[100px] truncate">
                                        {session.user.name || session.user.email}
                                    </span>
                                </button>

                                {accountMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg ring-1 ring-gray-200 py-2 z-50">
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setAccountMenuOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setAccountMenuOpen(false);
                                                signOut({ callbackUrl: "/" });
                                            }}
                                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 ml-2">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 rounded-full text-sm font-semibold text-gray-700 hover:bg-white/50 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-4 py-2 rounded-full bg-medical-green-600 text-white text-sm font-semibold shadow-sm hover:bg-medical-green-500 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
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
                                href="https://lms.mrcgpfasttrack.com"
                                className="mt-2 text-center text-sm font-bold text-white bg-gradient-to-r from-medical-green-600 to-medical-blue-600 px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                                onClick={() => setIsOpen(false)}
                            >
                                Access LMS Portal
                            </Link>

                            <div className="mt-3 pt-3 border-t border-gray-200/60">
                                {status === "loading" ? (
                                    <div className="h-10 w-full rounded-xl bg-gray-200 animate-pulse" />
                                ) : session?.user ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3 px-4 py-2">
                                            {session.user.image ? (
                                                <Image
                                                    src={session.user.image}
                                                    alt={session.user.name || "Student"}
                                                    width={36}
                                                    height={36}
                                                    className="rounded-full"
                                                />
                                            ) : (
                                                <div className="h-9 w-9 rounded-full bg-medical-green-100 flex items-center justify-center">
                                                    <User className="h-5 w-5 text-medical-green-700" />
                                                </div>
                                            )}
                                            <span className="text-sm font-medium text-gray-800 truncate">
                                                {session.user.name || session.user.email}
                                            </span>
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-white/40"
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                signOut({ callbackUrl: "/" });
                                            }}
                                            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 text-left"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Log Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="text-center text-sm font-semibold text-gray-700 px-4 py-3 rounded-xl border border-gray-200 hover:bg-white/40"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={() => setIsOpen(false)}
                                            className="text-center text-sm font-bold text-white bg-medical-green-600 px-4 py-3 rounded-xl shadow-md hover:bg-medical-green-500"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
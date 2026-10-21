"use client";

import Link from "next/link";
import { Menu, X, User, LogOut, LayoutDashboard, Phone, Mail, ChevronDown, GraduationCap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import Logo from "@/app/logo.png";
import Image from "next/image";

const LMS_URL = "https://lms.mrcgpfasttrack.com";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/exams", label: "Mock Exams" },
    { href: "/testimonials", label: "Success Stories" },
    { href: "/staff", label: "Faculty" },
    { href: "/contact", label: "Contact" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const accountRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const { data: session, status } = useSession();

    const toggleMenu = () => setIsOpen(!isOpen);
    const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

    // Close the account menu when clicking elsewhere
    useEffect(() => {
        if (!accountMenuOpen) return;
        const onClick = (e: MouseEvent) => {
            if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountMenuOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [accountMenuOpen]);

    return (
        <header className="sticky top-0 z-50 w-full">
            {/* Contact strip */}
            <div className="hidden bg-ink-900 text-ink-200 lg:block">
                <div className="container mx-auto flex h-9 items-center justify-between px-4 text-xs sm:px-6 lg:px-8">
                    <p className="text-ink-300">MRCGP [INT] exam preparation for doctors in primary care</p>
                    <div className="flex items-center gap-6">
                        <a href="tel:+94718739060" className="flex items-center gap-1.5 hover:text-white transition-colors">
                            <Phone className="h-3 w-3 text-medical-green-300" aria-hidden="true" />
                            +94 71 873 9060
                        </a>
                        <a
                            href="mailto:mrcgpinternationalosce@gmail.com"
                            className="flex items-center gap-1.5 hover:text-white transition-colors"
                        >
                            <Mail className="h-3 w-3 text-medical-green-300" aria-hidden="true" />
                            mrcgpinternationalosce@gmail.com
                        </a>
                    </div>
                </div>
            </div>

            <nav className="w-full border-b border-ink-100 bg-white/95 backdrop-blur-md" aria-label="Main">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-[68px] items-center justify-between gap-4">
                        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="MRCGP Fast Track home">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-medical-green-50 ring-1 ring-medical-green-100">
                                <Image src={Logo} alt="" className="h-7 w-7 object-contain" />
                            </span>
                            <span className="leading-tight">
                                <span className="block font-display text-lg font-extrabold text-ink-900">
                                    MRCGP <span className="text-medical-green-600">Fast Track</span>
                                </span>
                                <span className="hidden text-[11px] font-medium text-ink-500 sm:block">Family Medicine Forum</span>
                            </span>
                        </Link>

                        {/* Desktop navigation */}
                        <div className="hidden items-center gap-1 lg:flex">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    aria-current={isActive(link.href) ? "page" : undefined}
                                    className={cn(
                                        "relative rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
                                        isActive(link.href)
                                            ? "text-medical-green-700 bg-medical-green-50"
                                            : "text-ink-600 hover:text-ink-900 hover:bg-ink-50"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div className="hidden items-center gap-2 lg:flex">
                            <Link
                                href={LMS_URL}
                                className="inline-flex items-center gap-2 rounded-xl border border-medical-green-200 bg-medical-green-50 px-4 py-2 text-sm font-semibold text-medical-green-800 transition-colors hover:bg-medical-green-100"
                            >
                                <GraduationCap className="h-4 w-4" aria-hidden="true" />
                                LMS Portal
                            </Link>

                            {/* Auth section */}
                            {status === "loading" ? (
                                <div className="h-10 w-28 rounded-xl bg-ink-100 animate-pulse" />
                            ) : session?.user ? (
                                <div className="relative" ref={accountRef}>
                                    <button
                                        onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                                        aria-haspopup="menu"
                                        aria-expanded={accountMenuOpen}
                                        className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white py-1.5 pl-1.5 pr-3 transition-colors hover:bg-ink-50"
                                    >
                                        {session.user.image ? (
                                            <Image
                                                src={session.user.image}
                                                alt=""
                                                width={28}
                                                height={28}
                                                className="rounded-lg"
                                            />
                                        ) : (
                                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-medical-green-100">
                                                <User className="h-4 w-4 text-medical-green-700" />
                                            </div>
                                        )}
                                        <span className="max-w-[110px] truncate text-sm font-semibold text-ink-800">
                                            {session.user.name || session.user.email}
                                        </span>
                                        <ChevronDown className="h-3.5 w-3.5 text-ink-400" aria-hidden="true" />
                                    </button>

                                    {accountMenuOpen && (
                                        <div
                                            role="menu"
                                            className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-ink-100 bg-white py-1.5 shadow-lift"
                                        >
                                            <Link
                                                href="/dashboard"
                                                role="menuitem"
                                                onClick={() => setAccountMenuOpen(false)}
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
                                            >
                                                <LayoutDashboard className="h-4 w-4 text-ink-400" />
                                                My Dashboard
                                            </Link>
                                            <button
                                                role="menuitem"
                                                onClick={() => {
                                                    setAccountMenuOpen(false);
                                                    signOut({ callbackUrl: "/" });
                                                }}
                                                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Log Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5">
                                    <Link
                                        href="/login"
                                        className="rounded-lg px-3.5 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="rounded-xl bg-medical-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-medical-green-700"
                                    >
                                        Sign up free
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="rounded-lg p-2 text-ink-700 hover:bg-ink-50 lg:hidden"
                            onClick={toggleMenu}
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isOpen}
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile navigation */}
                {isOpen && (
                    <div className="border-t border-ink-100 bg-white lg:hidden">
                        <div className="container mx-auto flex flex-col gap-1 px-4 py-4 sm:px-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    aria-current={isActive(link.href) ? "page" : undefined}
                                    className={cn(
                                        "rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                                        isActive(link.href)
                                            ? "bg-medical-green-50 text-medical-green-700"
                                            : "text-ink-700 hover:bg-ink-50"
                                    )}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href={LMS_URL}
                                className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-medical-green-200 bg-medical-green-50 px-4 py-3 text-sm font-semibold text-medical-green-800"
                                onClick={() => setIsOpen(false)}
                            >
                                <GraduationCap className="h-4 w-4" aria-hidden="true" />
                                Access LMS Portal
                            </Link>

                            <div className="mt-3 border-t border-ink-100 pt-3">
                                {status === "loading" ? (
                                    <div className="h-11 w-full rounded-xl bg-ink-100 animate-pulse" />
                                ) : session?.user ? (
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-3 px-4 py-2">
                                            {session.user.image ? (
                                                <Image
                                                    src={session.user.image}
                                                    alt=""
                                                    width={36}
                                                    height={36}
                                                    className="rounded-lg"
                                                />
                                            ) : (
                                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-medical-green-100">
                                                    <User className="h-5 w-5 text-medical-green-700" />
                                                </div>
                                            )}
                                            <span className="truncate text-sm font-semibold text-ink-800">
                                                {session.user.name || session.user.email}
                                            </span>
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-50"
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            My Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                signOut({ callbackUrl: "/" });
                                            }}
                                            className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Log Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link
                                            href="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="rounded-xl border border-ink-200 px-4 py-3 text-center text-sm font-semibold text-ink-800 hover:bg-ink-50"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={() => setIsOpen(false)}
                                            className="rounded-xl bg-medical-green-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-medical-green-700"
                                        >
                                            Sign up free
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

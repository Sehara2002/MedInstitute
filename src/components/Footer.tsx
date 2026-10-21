import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import Logo from "@/app/logo.png";

const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/exams", label: "Mock Exams" },
    { href: "/testimonials", label: "Success Stories" },
    { href: "/staff", label: "Faculty" },
    { href: "/contact", label: "Contact Us" },
];

const studentLinks = [
    { href: "/signup", label: "Create a free account" },
    { href: "/login", label: "Student login" },
    { href: "/dashboard", label: "My dashboard" },
    { href: "https://lms.mrcgpfasttrack.com", label: "LMS Portal" },
];

export function Footer() {
    return (
        <footer className="mt-24 bg-ink-900 text-ink-300">
            <div className="container mx-auto px-4 pt-16 pb-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                                <Image src={Logo} alt="" className="h-7 w-7 object-contain" />
                            </span>
                            <span className="font-display text-lg font-extrabold text-white">
                                MRCGP <span className="text-medical-green-300">Fast Track</span>
                            </span>
                        </Link>
                        <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-300">
                            Family Medicine Forum supports doctors pursuing postgraduate qualifications in Family
                            Medicine and Primary Care, with exam-focused training for MRCGP [INT].
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">Explore</h3>
                        <ul className="mt-5 space-y-3 text-sm">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="transition-colors hover:text-white">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">For students</h3>
                        <ul className="mt-5 space-y-3 text-sm">
                            {studentLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="inline-flex items-center gap-1 transition-colors hover:text-white"
                                    >
                                        {link.label}
                                        {link.href.startsWith("http") && <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">Contact</h3>
                        <ul className="mt-5 space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-medical-green-300" aria-hidden="true" />
                                <span>
                                    29 C, Perera Avenue,
                                    <br />
                                    Kohuwala, Nugegoda,
                                    <br />
                                    Sri Lanka
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-4 w-4 shrink-0 text-medical-green-300" aria-hidden="true" />
                                <a href="tel:+94718739060" className="transition-colors hover:text-white">
                                    +94 71 873 9060
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-4 w-4 shrink-0 text-medical-green-300" aria-hidden="true" />
                                <a
                                    href="mailto:mrcgpinternationalosce@gmail.com"
                                    className="break-all transition-colors hover:text-white"
                                >
                                    mrcgpinternationalosce@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-ink-400 sm:flex-row">
                    <p>© {new Date().getFullYear()} Family Medicine Forum. All rights reserved.</p>
                    <p>MRCGP Fast Track by Family Medicine Forum</p>
                </div>
            </div>
        </footer>
    );
}

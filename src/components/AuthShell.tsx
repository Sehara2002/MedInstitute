import React from "react";
import Image from "next/image";
import { PlayCircle, BookOpen, LayoutDashboard } from "lucide-react";
import Logo from "@/app/logo.png";

const perks = [
    { icon: PlayCircle, text: "Watch free preview videos from every course" },
    { icon: BookOpen, text: "Register for courses and mock exams in minutes" },
    { icon: LayoutDashboard, text: "Keep your enrolled courses in one dashboard" },
];

/** Two-column frame for login and sign-up: a brand panel beside the form */
export function AuthShell({ children }: { children: React.ReactNode }) {
    return (
        <section className="grid min-h-[calc(100vh-104px)] grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
            <aside className="relative isolate hidden overflow-hidden bg-ink-900 p-12 text-white lg:flex lg:flex-col lg:justify-center">
                <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-br from-ink-900 via-ink-900 to-medical-green-900" />
                <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 opacity-[0.06]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                        backgroundSize: "44px 44px",
                    }}
                />
                <div aria-hidden="true" className="absolute -bottom-24 -right-24 -z-10 h-80 w-80 rounded-full bg-medical-green-500/20 blur-3xl" />
                <div className="mx-auto max-w-md">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                        <Image src={Logo} alt="" className="h-9 w-9 object-contain" />
                    </span>
                    <h2 className="mt-8 font-display text-3xl font-extrabold leading-tight">
                        Your MRCGP [INT] journey starts here
                    </h2>
                    <p className="mt-4 leading-relaxed text-ink-200">
                        Join Family Medicine Forum for exam-focused training, mock exams and guided preparation.
                    </p>
                    <ul className="mt-10 space-y-5">
                        {perks.map((perk) => (
                            <li key={perk.text} className="flex items-center gap-4">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-medical-green-500/20 text-medical-green-200 ring-1 ring-medical-green-400/30">
                                    <perk.icon className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <span className="text-sm font-medium text-ink-100">{perk.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
            <div className="flex items-center justify-center bg-ink-50 px-4 py-12 sm:px-8">{children}</div>
        </section>
    );
}

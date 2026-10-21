import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
    eyebrow?: string;
    title: React.ReactNode;
    description?: React.ReactNode;
    /** Optional content under the description, e.g. a notice or a button */
    children?: React.ReactNode;
    align?: "left" | "center";
    className?: string;
}

/** The banner at the top of every inner page: deep navy with a faint clinical grid */
export function PageHeader({ eyebrow, title, description, children, align = "center", className }: PageHeaderProps) {
    const centered = align === "center";
    return (
        <section className={cn("relative isolate overflow-hidden bg-ink-900", className)}>
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-br from-ink-900 via-ink-900 to-medical-green-900" />
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 opacity-[0.07]"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                    backgroundSize: "44px 44px",
                }}
            />
            <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-medical-green-500/20 blur-3xl" />

            <div className="container mx-auto px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
                <div className={cn("max-w-3xl", centered && "mx-auto text-center")}>
                    {eyebrow && (
                        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-medical-green-200 ring-1 ring-white/15">
                            {eyebrow}
                        </span>
                    )}
                    <h1 className="font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">{title}</h1>
                    {description && <p className="mt-4 text-base leading-relaxed text-ink-200 sm:text-lg">{description}</p>}
                    {children && <div className="mt-6">{children}</div>}
                </div>
            </div>
        </section>
    );
}

interface SectionHeadingProps {
    eyebrow?: string;
    title: React.ReactNode;
    description?: React.ReactNode;
    align?: "left" | "center";
    className?: string;
}

/** Heading block for a section inside a page */
export function SectionHeading({ eyebrow, title, description, align = "center", className }: SectionHeadingProps) {
    const centered = align === "center";
    return (
        <div className={cn("mb-10 max-w-2xl sm:mb-12", centered && "mx-auto text-center", className)}>
            {eyebrow && <span className="eyebrow mb-3">{eyebrow}</span>}
            <h2 className="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl md:text-4xl">{title}</h2>
            {description && <p className="mt-3 text-base leading-relaxed text-ink-600 sm:text-lg">{description}</p>}
        </div>
    );
}

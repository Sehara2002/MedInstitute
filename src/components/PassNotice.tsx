import Link from "next/link";
import { Footer } from "@/components/Footer";
import { PassBrandBar } from "@/components/PassBrandBar";

/** A full page message for a link that can't show its session: not valid, unavailable, ended */
export function PassNotice({
    icon,
    title,
    children,
    actions,
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
}) {
    return (
        <>
            <PassBrandBar />
            <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
                <div className="w-full max-w-lg rounded-2xl border border-ink-100 bg-white p-8 text-center shadow-soft">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-50 text-ink-500">{icon}</div>
                    <h1 className="font-display text-2xl font-extrabold text-ink-900">{title}</h1>
                    <div className="mt-3 space-y-3 leading-relaxed text-ink-600">{children}</div>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        {actions ?? (
                            <>
                                <Link href="/contact" className="btn-secondary">
                                    Contact us
                                </Link>
                                <Link href="/courses" className="btn-primary">
                                    View courses
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

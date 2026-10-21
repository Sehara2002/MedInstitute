import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Clock, MapPin, Armchair, Video, ShieldCheck, CheckCircle2, Hourglass, LockKeyhole, AlertTriangle, ArrowRight } from "lucide-react";
import Logo from "@/app/logo.png";
import { Footer } from "@/components/Footer";
import { PageHeader, SectionHeading } from "@/components/PageHeader";
import { CourseCard } from "@/components/CourseCard";
import { PassCountdown } from "@/components/PassCountdown";
import { getPass, formatSessionDate, formatSessionTime, KIND_LABEL, type EventPass } from "@/lib/eventPass";
import { listCourses } from "@/lib/citech";
import { lmsOrigin } from "@/lib/lms";

// The state depends on the time and on an admin's switch: never cached, never indexed. The link
// holds the guest's secret, so it must not leak through the Referer header either.
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
    title: "Your online session",
    robots: { index: false, follow: false, nocache: true },
    referrer: "no-referrer",
};

interface PageProps {
    params: Promise<{ token: string }>;
}

function BrandBar() {
    return (
        <div className="border-b border-ink-100 bg-white">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-3" aria-label="MRCGP Fast Track home">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-medical-green-50 ring-1 ring-medical-green-100">
                        <Image src={Logo} alt="" className="h-7 w-7 object-contain" />
                    </span>
                    <span className="font-display text-lg font-extrabold text-ink-900">
                        MRCGP <span className="text-medical-green-600">Fast Track</span>
                    </span>
                </Link>
                <span className="hidden items-center gap-1.5 text-xs font-semibold text-ink-500 sm:flex">
                    <ShieldCheck className="h-4 w-4 text-medical-green-600" aria-hidden="true" />
                    Your personal session link
                </span>
            </div>
        </div>
    );
}

function Notice({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
        <>
            <BrandBar />
            <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
                <div className="w-full max-w-lg rounded-2xl border border-ink-100 bg-white p-8 text-center shadow-soft">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-50 text-ink-500">{icon}</div>
                    <h1 className="font-display text-2xl font-extrabold text-ink-900">{title}</h1>
                    <div className="mt-3 space-y-3 leading-relaxed text-ink-600">{children}</div>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Link href="/contact" className="btn-secondary">
                            Contact us
                        </Link>
                        <Link href="/courses" className="btn-primary">
                            View courses
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

function StateCard({ pass }: { pass: EventPass }) {
    const noun = KIND_LABEL[pass.kind];

    if (pass.state === "LIVE" && pass.joinUrl) {
        return (
            <div className="rounded-2xl border border-medical-green-200 bg-medical-green-50 p-7">
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-medical-green-800">
                    <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-medical-green-500 opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-medical-green-600" />
                    </span>
                    Open to join
                </p>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-ink-900">Your {noun} is ready</h2>
                <p className="mt-2 leading-relaxed text-ink-600">
                    Join with the button below. It opens in a new tab. Please join a few minutes early to check your sound and camera.
                </p>
                <a href={pass.joinUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-5 !px-8 !py-3.5 text-base">
                    <Video className="h-5 w-5" aria-hidden="true" />
                    Join the {noun}
                </a>
            </div>
        );
    }

    if (pass.state === "UPCOMING") {
        return (
            <div className="rounded-2xl border border-ink-100 bg-white p-7 shadow-soft">
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-ink-500">
                    <Hourglass className="h-4 w-4" aria-hidden="true" />
                    Coming up
                </p>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-ink-900">
                    Starts on {formatSessionDate(pass.event.startsAt)}
                </h2>
                <p className="mt-2 leading-relaxed text-ink-600">
                    Come back to this page about 30 minutes before the start: the join button appears here. You can keep this link and the
                    email it came in.
                </p>
                <div className="mt-4">
                    <PassCountdown opensAt={pass.opensAt} />
                </div>
            </div>
        );
    }

    if (pass.state === "ENDED") {
        return (
            <div className="rounded-2xl border border-ink-100 bg-white p-7 shadow-soft">
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-ink-500">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Session ended
                </p>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-ink-900">Thank you for joining us</h2>
                <p className="mt-2 leading-relaxed text-ink-600">
                    This {noun} has finished, so this link is no longer active. It is kept on record. Ready for the next step? Explore our courses
                    below.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-7">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-800">
                <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                Link switched off
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-ink-900">This link is not active</h2>
            <p className="mt-2 leading-relaxed text-ink-700">
                The institute has switched this link off. If you think this is a mistake, please contact us and we will sort it out.
            </p>
            <Link href="/contact" className="btn-secondary mt-4">
                Contact us
            </Link>
        </div>
    );
}

export default async function JoinPage({ params }: PageProps) {
    const { token } = await params;
    const lookup = await getPass(token);

    if (lookup.status === "not_found") {
        return (
            <Notice icon={<AlertTriangle className="h-7 w-7" />} title="This link isn’t valid">
                <p>The link may be incomplete or mistyped. Please open the link from your confirmation email again.</p>
                <p>If you can’t find the email, open your booking page and choose “Send my link again”, or contact us.</p>
            </Notice>
        );
    }

    if (lookup.status === "unavailable") {
        return (
            <Notice icon={<Clock className="h-7 w-7" />} title="We couldn’t load your session">
                <p>This is usually temporary. Please refresh the page in a moment.</p>
            </Notice>
        );
    }

    const { pass } = lookup;
    const origin = lmsOrigin();
    const poster = pass.event.posterUrl && origin ? `${origin}${pass.event.posterUrl}` : null;
    const noun = KIND_LABEL[pass.kind];
    const firstName = pass.participant.firstName;
    // Public courses with registration: the guest has no LMS access, so this is where they can take the next step
    const courses = (await listCourses())?.filter((c) => !c.isFree).slice(0, 6) ?? [];

    return (
        <>
            <BrandBar />
            <main>
                <PageHeader
                    align="left"
                    eyebrow={`Your online ${noun}`}
                    title={`Welcome, ${firstName}`}
                    description={
                        <>
                            You&apos;re registered for <strong className="text-white">{pass.event.title}</strong>.
                        </>
                    }
                />

                <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
                    <div className="space-y-6">
                        <StateCard pass={pass} />

                        <div className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-white p-5 text-sm leading-relaxed text-ink-600">
                            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-medical-green-600" aria-hidden="true" />
                            <p>
                                This page is just for you. You are identified by your link, so there is nothing to sign in to. It opens this {noun}{" "}
                                only, stops working shortly after it ends, and gives no access to anything else. Please don&apos;t share it.
                            </p>
                        </div>

                        {pass.event.description && (
                            <div className="rounded-2xl border border-ink-100 bg-white p-6">
                                <h2 className="font-display text-lg font-extrabold text-ink-900">About this {noun}</h2>
                                <p className="mt-2 whitespace-pre-line leading-relaxed text-ink-600">{pass.event.description}</p>
                            </div>
                        )}
                    </div>

                    <aside className="space-y-4">
                        {poster && (
                            // The poster is served by the LMS backend through a signed redirect
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={poster} alt={pass.event.title} className="w-full rounded-2xl border border-ink-100 shadow-soft" />
                        )}
                        <dl className="space-y-4 rounded-2xl border border-ink-100 bg-white p-6 text-sm shadow-soft">
                            <div className="flex gap-3">
                                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-medical-green-600" aria-hidden="true" />
                                <div>
                                    <dt className="sr-only">Date</dt>
                                    <dd className="font-semibold text-ink-900">{formatSessionDate(pass.event.startsAt)}</dd>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-medical-green-600" aria-hidden="true" />
                                <div>
                                    <dt className="sr-only">Time</dt>
                                    <dd className="font-semibold text-ink-900">
                                        {formatSessionTime(pass.event.startsAt)} – {formatSessionTime(pass.event.endsAt)}
                                    </dd>
                                    <dd className="text-xs text-ink-500">Sri Lanka time</dd>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-medical-green-600" aria-hidden="true" />
                                <div>
                                    <dt className="sr-only">Where</dt>
                                    <dd className="font-semibold text-ink-900">{pass.event.venue}</dd>
                                </div>
                            </div>
                            {pass.participant.slotNumber !== null && (
                                <div className="flex gap-3">
                                    <Armchair className="mt-0.5 h-4 w-4 shrink-0 text-medical-green-600" aria-hidden="true" />
                                    <div>
                                        <dt className="sr-only">Your seat</dt>
                                        <dd className="font-semibold text-ink-900">Your seat: #{pass.participant.slotNumber}</dd>
                                    </div>
                                </div>
                            )}
                            <div className="border-t border-ink-100 pt-4 text-xs text-ink-500">
                                Registered as {[pass.participant.firstName, pass.participant.lastName].filter(Boolean).join(" ")}
                                <br />
                                {pass.participant.email}
                            </div>
                        </dl>
                    </aside>
                </div>

                {courses.length > 0 && (
                    <section className="border-t border-ink-100 bg-ink-50/60 py-14 sm:py-20">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <SectionHeading
                                eyebrow="Keep going"
                                title="Prepare further with our courses"
                                description="Register for a course online. You can pay securely by card and get your LMS login by email."
                            />
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {courses.map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                            <div className="mt-8 text-center">
                                <Link href="/courses" className="inline-flex items-center gap-2 font-semibold text-medical-green-700 hover:text-medical-green-800">
                                    See all courses <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </Link>
                            </div>
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
}

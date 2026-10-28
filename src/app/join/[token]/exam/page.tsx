import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertTriangle, Clock, LockKeyhole } from "lucide-react";
import { Footer } from "@/components/Footer";
import { PassBrandBar } from "@/components/PassBrandBar";
import { PassNotice } from "@/components/PassNotice";
import { OnlineExamPlayer } from "@/components/exam/OnlineExamPlayer";
import { getPass } from "@/lib/eventPass";

// The exam is the guest's alone: never cached, never indexed, and no Referer, because the link
// holds their secret.
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
    title: "Online exam",
    robots: { index: false, follow: false, nocache: true },
    referrer: "no-referrer",
};

interface PageProps {
    params: Promise<{ token: string }>;
}

export default async function ExamPage({ params }: PageProps) {
    const { token } = await params;
    const lookup = await getPass(token);

    if (lookup.status === "not_found") {
        return (
            <PassNotice icon={<AlertTriangle className="h-7 w-7" />} title="This link isn’t valid">
                <p>The link may be incomplete or mistyped. Please open the link from your confirmation email again.</p>
            </PassNotice>
        );
    }
    if (lookup.status === "unavailable") {
        return (
            <PassNotice icon={<Clock className="h-7 w-7" />} title="We couldn’t load your exam" actions={<Link href={`/join/${token}`} className="btn-primary">Try again</Link>}>
                <p>This is usually temporary. Please refresh the page in a moment. Your answers so far are saved.</p>
            </PassNotice>
        );
    }

    const { pass } = lookup;
    // A link for something that is not an online exam has nothing to show here
    if (!pass.exam) redirect(`/join/${token}`);

    if (pass.state === "ENDED" || pass.state === "DEACTIVATED") {
        return (
            <PassNotice
                icon={<LockKeyhole className="h-7 w-7" />}
                title={pass.state === "ENDED" ? "This link is no longer active" : "This link is not active"}
                actions={<Link href="/contact" className="btn-secondary">Contact us</Link>}
            >
                <p>
                    {pass.state === "ENDED"
                        ? "The exam has finished, so this link has stopped working. If you handed in, a copy of your result was emailed to you."
                        : "The institute has switched this link off. If you think this is a mistake, please contact us."}
                </p>
            </PassNotice>
        );
    }

    const name = [pass.participant.firstName, pass.participant.lastName].filter(Boolean).join(" ");
    return (
        <>
            <PassBrandBar label="Online exam" />
            <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <OnlineExamPlayer token={token} title={pass.event.title} participantName={pass.participant.firstName} info={pass.exam} backHref={`/join/${token}`} />
                <p className="sr-only">Signed in as {name}</p>
            </main>
            <Footer />
        </>
    );
}

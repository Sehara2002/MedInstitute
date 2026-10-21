import { Flame, Star } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import type { Course } from "@/data/courses";

type Kind = "offers" | "featured";

const STYLES: Record<
    Kind,
    { title: string; text: string; icon: React.ReactNode; bubbles: [string, string, string]; panel: string }
> = {
    offers: {
        title: "Limited-Time Offers",
        text: "Special prices for a short time. The offer price applies when you start your payment before the offer ends.",
        icon: <Flame className="h-5 w-5 text-rose-500" aria-hidden="true" />,
        bubbles: ["bg-rose-200/50", "bg-orange-200/40", "bg-pink-200/30"],
        panel: "border-rose-100 bg-rose-50/50",
    },
    featured: {
        title: "Featured Courses",
        text: "Programmes hand-picked by our faculty.",
        icon: <Star className="h-5 w-5 fill-amber-400 text-amber-500" aria-hidden="true" />,
        bubbles: ["bg-amber-200/50", "bg-yellow-200/40", "bg-medical-green-200/30"],
        panel: "border-amber-100 bg-amber-50/50",
    },
};

/**
 * One highlighted band on the courses page. Limited-time offers and featured courses are
 * set separately in the LMS and shown in separate bands, each with its own colours.
 */
export function CourseHighlightSection({ kind, courses }: { kind: Kind; courses: Course[] }) {
    if (courses.length === 0) return null;
    const style = STYLES[kind];
    const headingId = `${kind}-heading`;

    return (
        <section aria-labelledby={headingId} className="relative isolate mb-12">
            {/* Soft bubble backdrop */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl">
                <span className={`absolute -top-10 left-10 h-48 w-48 rounded-full blur-3xl ${style.bubbles[0]}`} />
                <span className={`absolute -bottom-12 right-16 h-56 w-56 rounded-full blur-3xl ${style.bubbles[1]}`} />
                <span className={`absolute top-1/3 right-1/3 h-32 w-32 rounded-full blur-3xl ${style.bubbles[2]}`} />
            </div>
            <div className={`rounded-3xl border p-5 sm:p-8 ${style.panel}`}>
                <h2 id={headingId} className="flex items-center gap-2 font-display text-xl font-extrabold text-ink-900 mb-1">
                    {style.icon}
                    {style.title}
                </h2>
                <p className="text-sm text-ink-600 mb-6">{style.text}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </section>
    );
}

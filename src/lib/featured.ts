// Featured items for the home page slideshow: workshops and mock exams an admin
// has featured in the LMS, and featured courses. Each needs an image to be shown.
// Never throws: a slow or unreachable backend just means no featured slides.

import type { PosterSlide } from "@/components/PosterSlideshow";
import { listCourses } from "@/lib/citech";
import { getMockExams, posterSrc as examPoster } from "@/lib/mockExams.server";
import { getWorkshops, posterSrc as workshopPoster } from "@/lib/workshops.server";

const MAX_FEATURED = 4;
const TIMEOUT_MS = 3000;

/** Resolve to `fallback` when the promise fails or takes too long, so the home page never waits on the LMS */
async function orElse<T>(promise: Promise<T>, fallback: T): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
        return await Promise.race([
            promise,
            new Promise<T>((resolve) => {
                timer = setTimeout(() => resolve(fallback), TIMEOUT_MS);
            }),
        ]);
    } catch {
        return fallback;
    } finally {
        if (timer) clearTimeout(timer);
    }
}

export async function getFeaturedSlides(): Promise<PosterSlide[]> {
    const [workshops, exams, courses] = await Promise.all([
        orElse(getWorkshops(), []),
        orElse(getMockExams(), []),
        orElse(listCourses(), null),
    ]);

    const slides: PosterSlide[] = [];

    for (const w of workshops) {
        const src = workshopPoster(w);
        if (!w.isFeatured || !src) continue;
        slides.push({
            src,
            alt: `Featured workshop: ${w.title}`,
            href: w.isBookable ? `/workshops/${w.workshopId}/register` : "/workshops",
            badge: "Featured workshop",
            unoptimized: true,
        });
    }

    for (const e of exams) {
        const src = examPoster(e);
        if (!e.isFeatured || !src) continue;
        slides.push({
            src,
            alt: `Featured mock exam: ${e.title}`,
            href: e.isBookable ? `/exams/${e.mockExamId}/register` : "/exams",
            badge: "Featured mock exam",
            unoptimized: true,
        });
    }

    for (const c of courses ?? []) {
        if (!c.isFeatured || !c.coverImageUrl) continue;
        slides.push({
            src: c.coverImageUrl,
            alt: `Featured course: ${c.title}`,
            href: `/courses/${c.id}`,
            badge: "Featured course",
            unoptimized: true,
        });
    }

    return slides.slice(0, MAX_FEATURED);
}

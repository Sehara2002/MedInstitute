// What a CITech course costs, decided on the server from the live catalogue.
//
// The catalogue's fee `amount` is always what to charge right now: the limited-time
// offer price while an offer runs, otherwise the usual price. So:
//   - at registration the amount comes from the catalogue, never from the browser;
//   - just before payment it is checked again, because the offer may have ended in between.
//     A student who started paying before the end keeps the offer price (the gateway
//     session already carries it); one who comes back later pays the current price.

import { parseCourseId, type Course, type CourseFee } from "@/data/courses";
import { getCourse } from "@/lib/citech";

export type Priced =
    | { course: string; courseId: string; amount: number; fee: CourseFee; offerEndsAt: string | null }
    | { error: string; status: number };

/** The registration's course text: the title, plus the option when the course has several */
function describe(course: Course, fee: CourseFee): string {
    return course.fees.length > 1 ? `${course.title} (${fee.label})` : course.title;
}

async function loadPayableCourse(courseId: string): Promise<{ course: Course } | { error: string; status: number }> {
    const lookup = await getCourse(courseId);
    if (lookup.status === "unavailable") {
        return { error: "Course details are temporarily unavailable. Please try again shortly.", status: 503 };
    }
    if (lookup.status === "not_found") {
        return { error: "This course is no longer open for registration", status: 404 };
    }
    const course = lookup.course;
    if (course.isFree) {
        return { error: "This is a free course and needs no registration here", status: 400 };
    }
    if (!course.acceptsOnlinePayment) {
        return { error: "Online payment isn't available for this course. Please contact us to enroll.", status: 400 };
    }
    return { course };
}

function priced(course: Course, fee: CourseFee): Priced {
    return {
        course: describe(course, fee),
        courseId: course.id,
        amount: fee.amount,
        fee,
        offerEndsAt: fee.originalAmount !== undefined ? course.offer?.endsAt ?? null : null,
    };
}

/**
 * Price a CITech course for a new registration. Only the option key comes from the
 * client; the title and amount are always the catalogue's own.
 */
export async function priceCitechCourse(courseId: string, feeKey: unknown): Promise<Priced> {
    const loaded = await loadPayableCourse(courseId);
    if ("error" in loaded) return loaded;
    const { course } = loaded;

    const fee = course.fees.length === 1 ? course.fees[0] : course.fees.find((f) => f.key === feeKey);
    if (!fee) {
        return { error: "Please select a valid mode of delivery", status: 400 };
    }
    return priced(course, fee);
}

/**
 * Price an existing registration again, just before payment. The option it was made for is
 * recovered from its course text ("Title (Online · Group)"), which describe() wrote.
 */
export async function repriceRegistration(registration: { courseId: string | null; course: string }): Promise<Priced | null> {
    if (!registration.courseId || parseCourseId(registration.courseId) === null) return null; // not a CITech course

    const loaded = await loadPayableCourse(registration.courseId);
    if ("error" in loaded) return loaded;
    const { course } = loaded;

    const fee =
        course.fees.length === 1
            ? course.fees[0]
            : course.fees.find((f) => registration.course.endsWith(`(${f.label})`));
    if (!fee) {
        return {
            error: "The study option you registered for is no longer offered. Please register again to choose another.",
            status: 409,
        };
    }
    return priced(course, fee);
}

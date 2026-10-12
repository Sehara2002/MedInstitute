import type { Course, CourseFee } from "@/data/courses";

/** The cheapest option, used as the "From …" price on cards */
export function cheapestFee(course: Pick<Course, "fees">): CourseFee | null {
    if (course.fees.length === 0) return null;
    return course.fees.reduce((min, fee) => (fee.amount < min.amount ? fee : min));
}

/** Rounded saving of an offer fee, e.g. 20 for 80 instead of 100; null when not discounted */
export function savingPercent(fee: Pick<CourseFee, "amount" | "originalAmount">): number | null {
    if (fee.originalAmount === undefined || !(fee.originalAmount > fee.amount)) return null;
    return Math.round((1 - fee.amount / fee.originalAmount) * 100);
}

/** The largest saving across a course's options, for an "up to X% off" bubble */
export function bestSaving(course: Pick<Course, "fees">): number | null {
    const savings = course.fees.map(savingPercent).filter((s): s is number => s !== null);
    return savings.length > 0 ? Math.max(...savings) : null;
}

/** Whether a course belongs in the highlighted band: featured, or on a running offer */
export function isHighlighted(course: Pick<Course, "isFeatured" | "offer" | "isFree">): boolean {
    return !course.isFree && (course.isFeatured || course.offer !== null);
}

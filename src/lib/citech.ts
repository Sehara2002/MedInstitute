// Server-side client for the CITech LMS public course catalogue
// (GET /api/public/courses). The catalogue is read without credentials, and
// every field is validated here, so nothing from the remote is trusted as-is.
//
// Environment:
//   NEXT_PUBLIC_LMS_API_URL  the LMS backend API, including /api (required),
//                            e.g. https://lms.citech.live/api. Course covers are
//                            served from it, and free courses link to the LMS page
//                            the backend gives as `joinUrl`.
//   MPGS_CURRENCY            the payment gateway's currency (shared with the payment routes)

import { courseContent, toCourseId, parseCourseId, type Course, type CourseFee } from "@/data/courses";

const DEFAULT_GATEWAY_CURRENCY = "LKR";
const REQUEST_TIMEOUT_MS = 8000;

const FORMAT_LABELS: Record<string, string> = { ONLINE: "Online", PHYSICAL: "Physical" };
const MODE_LABELS: Record<string, string> = { GROUP: "Group", INDIVIDUAL: "Individual" };

const FALLBACK_GRADIENTS = [
    "bg-gradient-to-br from-blue-100 to-indigo-200",
    "bg-gradient-to-br from-green-100 to-teal-200",
    "bg-gradient-to-br from-yellow-100 to-orange-200",
    "bg-gradient-to-br from-purple-100 to-pink-200",
    "bg-gradient-to-br from-red-100 to-orange-200",
    "bg-gradient-to-br from-sky-100 to-teal-200",
];

export type CourseLookup =
    | { status: "found"; course: Course }
    | { status: "not_found" }
    | { status: "unavailable" };

/** Shape of one course in the CITech public catalogue response */
interface PublicCourse {
    courseId: number;
    courseName: string;
    synopsis: string;
    level: string | null;
    instructor: string | null;
    deliveryModes: string[];
    whoCanApply: string[];
    durationWeeks: number;
    isFree: boolean;
    /** Absent on catalogues from before featured courses existed */
    isFeatured?: boolean;
    currencyCode: string | null;
    coverImageKey: string | null;
    /** Where a free course is joined in the LMS (set by the backend); absent on older catalogues */
    joinUrl?: string | null;
    modules: { moduleName: string; moduleOrder: number }[];
    /** The running limited-time offer; absent on older catalogues */
    offer?: { label: string | null; startsAt: string; endsAt: string } | null;
    /**
     * price         - what a student registering now pays (the offer price while one runs)
     * originalPrice - the usual price; offerPrice - set only while an offer lowers this option
     * (both absent on older catalogues)
     */
    deliveryOptions: { format: string; mode: string; price: number; originalPrice?: number; offerPrice?: number | null }[];
}

/**
 * A configured base URL, or null when it is missing or unsafe: only http(s),
 * no embedded credentials, and https unless it points at this machine.
 */
function readBaseUrl(name: string, fallback?: string): string | null {
    const raw = process.env[name]?.trim() || fallback;
    if (!raw) return null;

    let url: URL;
    try {
        url = new URL(raw);
    } catch {
        console.error(`[citech] ${name} is not a valid URL`);
        return null;
    }
    const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (url.username || url.password || !(url.protocol === "https:" || (url.protocol === "http:" && isLocal))) {
        console.error(`[citech] ${name} must be an https URL without credentials`);
        return null;
    }
    return `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
}

function gatewayCurrency(): string {
    return (process.env.MPGS_CURRENCY || DEFAULT_GATEWAY_CURRENCY).trim().toUpperCase();
}

function isString(value: unknown): value is string {
    return typeof value === "string";
}

function isStringList(value: unknown): value is string[] {
    return Array.isArray(value) && value.every(isString);
}

function isPositiveInteger(value: unknown): value is number {
    return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function isIsoDate(value: unknown): value is string {
    return isString(value) && !Number.isNaN(Date.parse(value));
}

/** Only http(s) links are ever rendered as a link */
function isWebUrl(value: unknown): value is string {
    if (!isString(value)) return false;
    try {
        const url = new URL(value);
        return url.protocol === "https:" || (url.protocol === "http:" && url.hostname === "localhost");
    } catch {
        return false;
    }
}

function isOptionalNumber(value: unknown): boolean {
    return value === undefined || value === null || (typeof value === "number" && Number.isFinite(value));
}

function isOffer(value: unknown): boolean {
    if (value === undefined || value === null) return true;
    if (typeof value !== "object") return false;
    const o = value as Record<string, unknown>;
    return (o.label === null || isString(o.label)) && isIsoDate(o.startsAt) && isIsoDate(o.endsAt);
}

function isPublicCourse(value: unknown): value is PublicCourse {
    if (!value || typeof value !== "object") return false;
    const c = value as Record<string, unknown>;
    return (
        isPositiveInteger(c.courseId) &&
        isString(c.courseName) && c.courseName.trim().length > 0 &&
        isString(c.synopsis) &&
        (c.level === null || isString(c.level)) &&
        (c.instructor === null || isString(c.instructor)) &&
        isStringList(c.deliveryModes) &&
        isStringList(c.whoCanApply) &&
        isPositiveInteger(c.durationWeeks) &&
        typeof c.isFree === "boolean" &&
        (c.isFeatured === undefined || typeof c.isFeatured === "boolean") &&
        (c.currencyCode === null || isString(c.currencyCode)) &&
        (c.coverImageKey === null || isString(c.coverImageKey)) &&
        (c.joinUrl === undefined || c.joinUrl === null || isWebUrl(c.joinUrl)) &&
        Array.isArray(c.modules) &&
        c.modules.every((m) => m && isString(m.moduleName)) &&
        isOffer(c.offer) &&
        Array.isArray(c.deliveryOptions) &&
        c.deliveryOptions.every(
            (o) =>
                o &&
                isString(o.format) &&
                isString(o.mode) &&
                typeof o.price === "number" &&
                isOptionalNumber(o.originalPrice) &&
                isOptionalNumber(o.offerPrice)
        )
    );
}

/** The offer, only while it is actually running (guards against a clock skew or a stale response) */
function runningOffer(course: PublicCourse, now: number = Date.now()): { label: string | null; endsAt: string } | null {
    if (!course.offer || course.isFree) return null;
    const ends = Date.parse(course.offer.endsAt);
    if (!(ends > now)) return null;
    const label = course.offer.label?.trim() || null;
    return { label, endsAt: new Date(ends).toISOString() };
}

function formatMoney(amount: number, currencyCode: string | null): string {
    const value = amount.toLocaleString("en-US", { maximumFractionDigits: 2 });
    return currencyCode ? `${currencyCode} ${value}` : value;
}

/**
 * The fee of each option. `amount` is always the catalogue's `price` (what to charge now);
 * the usual price is kept alongside only while a running offer really lowers it.
 */
function toFees(course: PublicCourse, currencyCode: string | null, offerRunning: boolean): CourseFee[] {
    if (course.isFree) return [];
    return course.deliveryOptions
        .filter((o) => FORMAT_LABELS[o.format] && MODE_LABELS[o.mode] && Number.isFinite(o.price) && o.price > 0)
        .map((o) => {
            const fee: CourseFee = {
                key: `${o.format}_${o.mode}`,
                label: `${FORMAT_LABELS[o.format]} · ${MODE_LABELS[o.mode]}`,
                amount: o.price,
                display: formatMoney(o.price, currencyCode),
            };
            const original = o.originalPrice;
            if (offerRunning && typeof o.offerPrice === "number" && typeof original === "number" && original > o.price) {
                fee.originalAmount = original;
                fee.originalDisplay = formatMoney(original, currencyCode);
            }
            return fee;
        });
}

function toCourse(course: PublicCourse, apiUrl: string): Course {
    const currencyCode = course.currencyCode?.trim().toUpperCase() || null;
    const offer = runningOffer(course);
    const fees = toFees(course, currencyCode, offer !== null);
    const content = courseContent.find((c) => c.citechCourseId === course.courseId);
    const formats = [...new Set(fees.map((f) => f.key.split("_")[0]))].map((f) => FORMAT_LABELS[f]);

    return {
        id: toCourseId(course.courseId),
        citechCourseId: course.courseId,
        title: course.courseName.trim(),
        description: course.synopsis,
        duration: `${course.durationWeeks} ${course.durationWeeks === 1 ? "week" : "weeks"}`,
        level: course.level || (course.isFree ? "Free Course" : "Course"),
        instructor: course.instructor,
        isFree: course.isFree,
        isFeatured: course.isFeatured === true,
        // Shown only when it actually lowers at least one fee
        offer: offer && fees.some((f) => f.originalAmount !== undefined) ? offer : null,
        currencyCode,
        fees,
        acceptsOnlinePayment: !course.isFree && fees.length > 0 && currencyCode === gatewayCurrency(),
        curriculum: [...course.modules].sort((a, b) => a.moduleOrder - b.moduleOrder).map((m) => m.moduleName),
        targetAudience: course.whoCanApply,
        mode: course.deliveryModes.length > 0 ? course.deliveryModes : formats,
        coverImageUrl: course.coverImageKey
            ? `${apiUrl}/public/courses/${course.courseId}/cover?v=${encodeURIComponent(course.coverImageKey)}`
            : null,
        imageUrl: FALLBACK_GRADIENTS[course.courseId % FALLBACK_GRADIENTS.length],
        // The LMS's free-course page; the backend knows the LMS address
        lmsUrl: course.isFree ? course.joinUrl ?? null : null,
        brochures: content?.brochures ?? [],
        freeVideos: content?.freeVideos ?? [],
        fullVideos: content?.fullVideos ?? [],
        requiresAccount: content?.requiresAccount ?? false,
    };
}

type FetchResult = { status: "ok"; data: unknown } | { status: "not_found" } | { status: "unavailable" };

/**
 * Always a live read: a course added or changed in the LMS shows up on the next
 * page load, and an outage shows as unavailable rather than as stale courses.
 */
async function fetchCatalogue(path: string): Promise<FetchResult> {
    const apiUrl = readBaseUrl("NEXT_PUBLIC_LMS_API_URL");
    if (!apiUrl) {
        console.error("[citech] NEXT_PUBLIC_LMS_API_URL is not configured");
        return { status: "unavailable" };
    }

    try {
        const res = await fetch(`${apiUrl}${path}`, {
            headers: { Accept: "application/json" },
            redirect: "error",
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
            cache: "no-store",
        });
        if (res.status === 404) return { status: "not_found" };
        if (!res.ok) {
            console.error(`[citech] ${path} answered ${res.status}`);
            return { status: "unavailable" };
        }
        const body: unknown = await res.json();
        if (!body || typeof body !== "object" || (body as { success?: unknown }).success !== true) {
            console.error(`[citech] ${path} returned an unexpected body`);
            return { status: "unavailable" };
        }
        return { status: "ok", data: (body as { data?: unknown }).data };
    } catch (err) {
        console.error(`[citech] ${path} failed:`, err instanceof Error ? err.message : err);
        return { status: "unavailable" };
    }
}

/**
 * Every active CITech course, newest first, or null when the catalogue cannot
 * be reached. Malformed entries are skipped rather than failing the page.
 */
export async function listCourses(): Promise<Course[] | null> {
    const result = await fetchCatalogue("/public/courses");
    if (result.status !== "ok" || !Array.isArray(result.data)) return null;

    const apiUrl = readBaseUrl("NEXT_PUBLIC_LMS_API_URL")!;
    const valid = result.data.filter(isPublicCourse);
    if (valid.length < result.data.length) {
        console.error(`[citech] skipped ${result.data.length - valid.length} malformed course(s)`);
    }
    console.log(`[citech] found ${valid.length} active course(s) in the catalogue: ${valid.map((c) => c.courseId).join(", ")}`);
    return valid.map((c) => toCourse(c, apiUrl));
}

/** One active CITech course by its "citech-<id>" course id */
export async function getCourse(courseId: string): Promise<CourseLookup> {
    const citechCourseId = parseCourseId(courseId);
    if (citechCourseId === null) return { status: "not_found" };

    const result = await fetchCatalogue(`/public/courses/${citechCourseId}`);
    if (result.status !== "ok") return result;
    if (!isPublicCourse(result.data) || result.data.courseId !== citechCourseId) {
        console.error(`[citech] course ${citechCourseId} returned an unexpected body`);
        return { status: "unavailable" };
    }

    const apiUrl = readBaseUrl("NEXT_PUBLIC_LMS_API_URL")!;
    return { status: "found", course: toCourse(result.data, apiUrl) };
}

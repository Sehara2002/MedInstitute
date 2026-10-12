// Server-side client for the CITech LMS public course catalogue
// (GET /api/public/courses). The catalogue is read without credentials, and
// every field is validated here, so nothing from the remote is trusted as-is.
//
// Environment:
//   CITECH_API_URL  base URL of the CITech LMS API (required)
//   CITECH_LMS_URL  base URL of the CITech LMS website, where free courses are joined
//   MPGS_CURRENCY   the payment gateway's currency (shared with the payment routes)

import { courseContent, toCourseId, parseCourseId, type Course, type CourseFee } from "@/data/courses";

const DEFAULT_LMS_URL = "https://lms.mrcgpfasttrack.com";
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
    currencyCode: string | null;
    coverImageKey: string | null;
    modules: { moduleName: string; moduleOrder: number }[];
    deliveryOptions: { format: string; mode: string; price: number }[];
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
        (c.currencyCode === null || isString(c.currencyCode)) &&
        (c.coverImageKey === null || isString(c.coverImageKey)) &&
        Array.isArray(c.modules) &&
        c.modules.every((m) => m && isString(m.moduleName)) &&
        Array.isArray(c.deliveryOptions) &&
        c.deliveryOptions.every((o) => o && isString(o.format) && isString(o.mode) && typeof o.price === "number")
    );
}

function formatMoney(amount: number, currencyCode: string | null): string {
    const value = amount.toLocaleString("en-US", { maximumFractionDigits: 2 });
    return currencyCode ? `${currencyCode} ${value}` : value;
}

function toFees(course: PublicCourse, currencyCode: string | null): CourseFee[] {
    if (course.isFree) return [];
    return course.deliveryOptions
        .filter((o) => FORMAT_LABELS[o.format] && MODE_LABELS[o.mode] && Number.isFinite(o.price) && o.price > 0)
        .map((o) => ({
            key: `${o.format}_${o.mode}`,
            label: `${FORMAT_LABELS[o.format]} · ${MODE_LABELS[o.mode]}`,
            amount: o.price,
            display: formatMoney(o.price, currencyCode),
        }));
}

function toCourse(course: PublicCourse, apiUrl: string, lmsUrl: string | null): Course {
    const currencyCode = course.currencyCode?.trim().toUpperCase() || null;
    const fees = toFees(course, currencyCode);
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
        currencyCode,
        fees,
        acceptsOnlinePayment: !course.isFree && fees.length > 0 && currencyCode === gatewayCurrency(),
        curriculum: [...course.modules].sort((a, b) => a.moduleOrder - b.moduleOrder).map((m) => m.moduleName),
        targetAudience: course.whoCanApply,
        mode: course.deliveryModes.length > 0 ? course.deliveryModes : formats,
        coverImageUrl: course.coverImageKey
            ? `${apiUrl}/api/public/courses/${course.courseId}/cover?v=${encodeURIComponent(course.coverImageKey)}`
            : null,
        imageUrl: FALLBACK_GRADIENTS[course.courseId % FALLBACK_GRADIENTS.length],
        lmsUrl: course.isFree && lmsUrl ? `${lmsUrl}/free-courses/${course.courseId}` : null,
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
    const apiUrl = readBaseUrl("CITECH_API_URL");
    if (!apiUrl) {
        console.error("[citech] CITECH_API_URL is not configured");
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
    const result = await fetchCatalogue("/api/public/courses");
    if (result.status !== "ok" || !Array.isArray(result.data)) return null;

    const apiUrl = readBaseUrl("CITECH_API_URL")!;
    const lmsUrl = readBaseUrl("CITECH_LMS_URL", DEFAULT_LMS_URL);
    const valid = result.data.filter(isPublicCourse);
    if (valid.length < result.data.length) {
        console.error(`[citech] skipped ${result.data.length - valid.length} malformed course(s)`);
    }
    return valid.map((c) => toCourse(c, apiUrl, lmsUrl));
}

/** One active CITech course by its "citech-<id>" course id */
export async function getCourse(courseId: string): Promise<CourseLookup> {
    const citechCourseId = parseCourseId(courseId);
    if (citechCourseId === null) return { status: "not_found" };

    const result = await fetchCatalogue(`/api/public/courses/${citechCourseId}`);
    if (result.status !== "ok") return result;
    if (!isPublicCourse(result.data) || result.data.courseId !== citechCourseId) {
        console.error(`[citech] course ${citechCourseId} returned an unexpected body`);
        return { status: "unavailable" };
    }

    const apiUrl = readBaseUrl("CITECH_API_URL")!;
    const lmsUrl = readBaseUrl("CITECH_LMS_URL", DEFAULT_LMS_URL);
    return { status: "found", course: toCourse(result.data, apiUrl, lmsUrl) };
}

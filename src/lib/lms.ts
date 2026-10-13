// Server-side client for the MRCGP LMS backend: the only way this site reaches
// LMS data (courses, mock exams, registrations, payments). The site never opens
// the LMS database itself.
//
// Environment (server only, never sent to the browser):
//   LMS_BACKEND_URL   the backend API, including /api (e.g. https://lms.citech.live/api)
//   WEBSITE_API_KEY   shared secret for the few website-only routes (same value on the backend)

const REQUEST_TIMEOUT_MS = 20000;

export type LmsResult<T> =
    | { status: "ok"; data: T; body: Record<string, unknown> }
    | { status: "error"; httpStatus: number; message: string; body: Record<string, unknown> | null }
    | { status: "unavailable" };

/**
 * The configured backend URL, or null when missing or unsafe: http(s) only, no
 * embedded credentials, and https unless it points at this machine.
 */
export function lmsBaseUrl(): string | null {
    const raw = process.env.LMS_BACKEND_URL?.trim();
    if (!raw) return null;

    let url: URL;
    try {
        url = new URL(raw);
    } catch {
        console.error("[lms] LMS_BACKEND_URL is not a valid URL");
        return null;
    }
    const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (url.username || url.password || !(url.protocol === "https:" || (url.protocol === "http:" && isLocal))) {
        console.error("[lms] LMS_BACKEND_URL must be an https URL without credentials");
        return null;
    }
    return `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
}

/** The backend's origin (no /api), for links to files it serves such as course covers */
export function lmsOrigin(): string | null {
    const base = lmsBaseUrl();
    return base ? new URL(base).origin : null;
}

/**
 * Call the backend. `path` is relative to LMS_BACKEND_URL, e.g. "/public/courses".
 * Never throws: an unreachable or misconfigured backend is reported as "unavailable".
 */
export async function lmsFetch<T>(
    path: string,
    init: { method?: string; body?: unknown; websiteKey?: boolean } = {}
): Promise<LmsResult<T>> {
    const base = lmsBaseUrl();
    if (!base) {
        console.error("[lms] LMS_BACKEND_URL is not configured");
        return { status: "unavailable" };
    }

    const headers: Record<string, string> = { Accept: "application/json" };
    if (init.body !== undefined) headers["Content-Type"] = "application/json";
    if (init.websiteKey) {
        const key = process.env.WEBSITE_API_KEY?.trim();
        if (!key) {
            console.error("[lms] WEBSITE_API_KEY is not configured");
            return { status: "unavailable" };
        }
        headers["x-website-api-key"] = key;
    }

    let res: Response;
    try {
        res = await fetch(`${base}${path}`, {
            method: init.method || "GET",
            headers,
            body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
            redirect: "error",
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
            cache: "no-store",
        });
    } catch (err) {
        console.error(`[lms] ${path} failed:`, err instanceof Error ? err.message : err);
        return { status: "unavailable" };
    }

    const body = (await res.json().catch(() => null)) as Record<string, unknown> | null;
    if (!res.ok || !body || body.success !== true) {
        if (res.status >= 500 || !body) {
            console.error(`[lms] ${path} answered ${res.status}`);
            if (!body) return { status: "unavailable" };
        }
        return {
            status: "error",
            httpStatus: res.status,
            message: typeof body.message === "string" ? body.message : "Something went wrong. Please try again.",
            body,
        };
    }
    return { status: "ok", data: body.data as T, body };
}

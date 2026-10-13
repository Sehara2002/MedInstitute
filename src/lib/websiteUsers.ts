// Website accounts (sign-up, sign-in, profile, preview-video views and
// pre-LMS paid registrations) live in the LMS database. This site has no
// database of its own: it reaches them through the backend's /website/users
// routes with WEBSITE_API_KEY (see src/lib/lms.ts).

import { lmsFetch, type LmsResult } from "@/lib/lms";

export interface WebsiteUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  hasPassword: boolean;
  createdAt: string;
}

export interface VideoView {
  courseId: string;
  videoId: string;
  viewedAt: string;
}

export interface LegacyRegistration {
  id: string;
  course: string;
  courseId: string | null;
  amount: number;
  status: string;
  paidAt: string | null;
  createdAt: string;
}

const users = (path = "") => `/website/users${path}`;
const id = (userId: string) => encodeURIComponent(userId);

/** Email + password sign-in; null for a wrong email or password */
export async function verifyCredentials(email: string, password: string): Promise<WebsiteUser | null> {
  const result = await lmsFetch<WebsiteUser>(users("/login"), { method: "POST", body: { email, password }, websiteKey: true });
  if (result.status === "ok") return result.data;
  if (result.status === "error" && result.httpStatus === 401) return null;
  throw new Error("Sign-in is temporarily unavailable");
}

export function registerUser(input: { name: string; email: string; password: string }): Promise<LmsResult<WebsiteUser>> {
  return lmsFetch<WebsiteUser>(users("/register"), { method: "POST", body: input, websiteKey: true });
}

/** The account behind a Google sign-in, created (or linked by email) on first use */
export async function signInWithGoogle(profile: {
  providerAccountId: string;
  email: string;
  name?: string | null;
  image?: string | null;
  emailVerified?: boolean;
}): Promise<{ user: WebsiteUser; created: boolean }> {
  const result = await lmsFetch<{ user: WebsiteUser; created: boolean }>(users("/oauth"), {
    method: "POST",
    body: { provider: "google", ...profile },
    websiteKey: true,
  });
  if (result.status !== "ok") throw new Error("Google sign-in is temporarily unavailable");
  return result.data;
}

export async function getUser(userId: string): Promise<WebsiteUser | null> {
  const result = await lmsFetch<WebsiteUser>(users(`/${id(userId)}`), { websiteKey: true });
  return result.status === "ok" ? result.data : null;
}

export function updateName(userId: string, name: string): Promise<LmsResult<WebsiteUser>> {
  return lmsFetch<WebsiteUser>(users(`/${id(userId)}`), { method: "PATCH", body: { name }, websiteKey: true });
}

export function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<LmsResult<unknown>> {
  return lmsFetch(users(`/${id(userId)}/password`), {
    method: "POST",
    body: { currentPassword, newPassword },
    websiteKey: true,
  });
}

/** Preview videos watched, oldest first; [] when the backend cannot be reached */
export async function listVideoViews(userId: string, courseId?: string): Promise<VideoView[]> {
  const qs = courseId ? `?courseId=${encodeURIComponent(courseId)}` : "";
  const result = await lmsFetch<VideoView[]>(users(`/${id(userId)}/video-views${qs}`), { websiteKey: true });
  return result.status === "ok" ? result.data : [];
}

/** Record a preview video as watched; returns the course's views */
export function recordVideoView(userId: string, courseId: string, videoId: string): Promise<LmsResult<VideoView[]>> {
  return lmsFetch<VideoView[]>(users(`/${id(userId)}/video-views`), {
    method: "POST",
    body: { courseId, videoId },
    websiteKey: true,
  });
}

/** Paid registrations from before course registration moved to the LMS */
export async function listLegacyPaidRegistrations(userId: string): Promise<LmsResult<LegacyRegistration[]>> {
  return lmsFetch<LegacyRegistration[]>(users(`/${id(userId)}/legacy-registrations?status=paid`), { websiteKey: true });
}

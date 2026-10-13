// Which courses a website account has paid for, to unlock its videos and files.
//
// Two sources, merged, both read from the LMS backend with WEBSITE_API_KEY
// because they are private to the account:
//   - course registrations paid through the backend (current);
//   - older registrations from before payments moved to the LMS (copied from
//     this site's former database), so earlier students keep their access.

import { lmsFetch } from "@/lib/lms";
import { listLegacyPaidRegistrations } from "@/lib/websiteUsers";
import { toRegistration, type BackendRegistration } from "@/lib/registrations";

export interface PaidCourse {
  key: string;
  /** The course id this site uses ("citech-<id>" or an older content id) */
  courseId: string | null;
  /** The course name (and study option) it was paid under */
  course: string;
  paidAt: Date | null;
}

export async function listPaidCourses(websiteUserId: string): Promise<PaidCourse[]> {
  const [legacy, current] = await Promise.all([
    listLegacyPaidRegistrations(websiteUserId),
    lmsFetch<BackendRegistration[]>(`/website/course-registrations?websiteUserId=${encodeURIComponent(websiteUserId)}`, {
      websiteKey: true,
    }),
  ]);

  const fromLms: PaidCourse[] =
    current.status === "ok"
      ? current.data.map((r) => {
          const reg = toRegistration(r);
          return { key: reg.id, courseId: reg.courseId, course: reg.course, paidAt: reg.paidAt ? new Date(reg.paidAt) : null };
        })
      : [];
  if (current.status !== "ok") {
    console.error("[paidCourses] could not read paid registrations from the LMS; showing older ones only");
  }

  if (legacy.status !== "ok") {
    console.error("[paidCourses] could not read older paid registrations from the LMS");
  }
  const fromWebsite: PaidCourse[] =
    legacy.status === "ok"
      ? legacy.data.map((r) => ({ key: r.id, courseId: r.courseId, course: r.course, paidAt: r.paidAt ? new Date(r.paidAt) : null }))
      : [];

  return [...fromLms, ...fromWebsite].sort((a, b) => (b.paidAt?.getTime() ?? 0) - (a.paidAt?.getTime() ?? 0));
}

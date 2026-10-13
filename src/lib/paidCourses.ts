// Which courses a website account has paid for, to unlock its videos and files.
//
// Two sources, merged:
//   - registrations paid through the LMS backend (current), read with the shared
//     WEBSITE_API_KEY because they are private to the account;
//   - older registrations kept in this site's own database from before payments
//     moved to the LMS, so earlier students keep their access.

import { prisma } from "@/lib/prisma";
import { lmsFetch } from "@/lib/lms";
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
    prisma.registration.findMany({ where: { userId: websiteUserId, status: "paid" }, orderBy: { paidAt: "desc" } }),
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

  const fromWebsite: PaidCourse[] = legacy.map((r) => ({ key: r.id, courseId: r.courseId, course: r.course, paidAt: r.paidAt }));

  return [...fromLms, ...fromWebsite].sort((a, b) => (b.paidAt?.getTime() ?? 0) - (a.paidAt?.getTime() ?? 0));
}

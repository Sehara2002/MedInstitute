
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { accessCourseIds, findCourseContent, parseCourseId, toCourseId } from "@/data/courses";
import { EnrolledVideoPlayer } from "@/components/EnrolledVideoPlayer";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Paid content is served from the institute's own records, so it stays
// available even when the CITech catalogue cannot be reached.
export default async function EnrolledCoursePage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const content = findCourseContent(id);
  if (parseCourseId(id) === null && content?.citechCourseId !== undefined) {
    redirect(`/dashboard/enrolled/${toCourseId(content.citechCourseId)}`);
  }

  const paidRegistration = await prisma.registration.findFirst({
    where: { userId, courseId: { in: accessCourseIds(id) }, status: "paid" },
  });

  if (!paidRegistration) {
    if (parseCourseId(id) !== null) {
      redirect(`/register?id=${encodeURIComponent(id)}`);
    }
    notFound();
  }

  return (
    <EnrolledVideoPlayer
      course={{ title: content?.title ?? paidRegistration.course, fullVideos: content?.fullVideos ?? [] }}
      studentEmail={session!.user!.email || ""}
      studentName={session!.user!.name || "Student"}
    />
  );
}

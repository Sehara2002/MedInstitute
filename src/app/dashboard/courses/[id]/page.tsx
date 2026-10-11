import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { findCourseContent, parseCourseId, toCourseId } from "@/data/courses";
import { getCourse } from "@/lib/citech";
import { CourseVideoPlayer } from "@/components/CourseVideoPlayer";

interface PageProps {
  params: Promise<{ id: string }>;
}

const TRIAL_DAYS = 3;

export default async function CourseVideosPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const content = findCourseContent(id);
  if (parseCourseId(id) === null) {
    redirect(content?.citechCourseId !== undefined ? `/dashboard/courses/${toCourseId(content.citechCourseId)}` : "/dashboard");
  }

  const lookup = await getCourse(id);
  if (lookup.status === "not_found") {
    notFound();
  }
  const course = lookup.status === "found" ? lookup.course : null;
  const title = course?.title ?? content?.title;
  if (!title) {
    notFound();
  }

  const views = await prisma.videoView.findMany({
    where: { userId, courseId: id },
    select: { videoId: true, viewedAt: true },
    orderBy: { viewedAt: "asc" },
  });

  const watchedVideoIds = views.map((v) => v.videoId);
  const trialStartedAt = views[0]?.viewedAt || null;

  let trialExpiresAt: Date | null = null;
  let isTrialExpired = false;

  if (trialStartedAt) {
    trialExpiresAt = new Date(trialStartedAt);
    trialExpiresAt.setDate(trialExpiresAt.getDate() + TRIAL_DAYS);
    isTrialExpired = new Date() > trialExpiresAt;
  }

  return (
    <CourseVideoPlayer
      course={{ id, title, freeVideos: content?.freeVideos ?? [] }}
      registerHref={course?.acceptsOnlinePayment ? `/register?id=${encodeURIComponent(id)}` : `/courses/${id}`}
      initialWatchedIds={watchedVideoIds}
      trialExpiresAt={trialExpiresAt ? trialExpiresAt.toISOString() : null}
      isTrialExpired={isTrialExpired}
      studentEmail={session!.user!.email || ""}
    />
  );
}

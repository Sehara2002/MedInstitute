import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { courses } from "@/data/courses";
import { CourseVideoPlayer } from "@/components/CourseVideoPlayer";

interface PageProps {
  params: { id: string };
}

const TRIAL_DAYS = 3;

export default async function CourseVideosPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const course = courses.find((c) => c.id === id);
  if (!course) {
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
      course={course}
      initialWatchedIds={watchedVideoIds}
      trialExpiresAt={trialExpiresAt ? trialExpiresAt.toISOString() : null}
      isTrialExpired={isTrialExpired}
    />
  );
}
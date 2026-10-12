import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { findCourseContent } from "@/data/courses";

const TRIAL_DAYS = 3;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { courseId, videoId } = await req.json();

  if (typeof courseId !== "string" || typeof videoId !== "string" || !courseId || !videoId) {
    return NextResponse.json({ error: "courseId and videoId are required" }, { status: 400 });
  }

  // Only the course's own free preview videos are tracked
  const isPreview = findCourseContent(courseId)?.freeVideos?.some((v) => v.id === videoId);
  if (!isPreview) {
    return NextResponse.json({ error: "Unknown preview video" }, { status: 400 });
  }

  const existingViews = await prisma.videoView.findMany({
    where: { userId, courseId },
    orderBy: { viewedAt: "asc" },
  });

  if (existingViews.length > 0) {
    const trialStart = existingViews[0].viewedAt;
    const trialExpiry = new Date(trialStart);
    trialExpiry.setDate(trialExpiry.getDate() + TRIAL_DAYS);

    if (new Date() > trialExpiry) {
      return NextResponse.json({ error: "Free trial period has expired" }, { status: 403 });
    }
  }

  await prisma.videoView.upsert({
    where: {
      userId_courseId_videoId: { userId, courseId, videoId },
    },
    update: {},
    create: { userId, courseId, videoId },
  });

  const views = await prisma.videoView.findMany({
    where: { userId, courseId },
    select: { videoId: true },
  });

  return NextResponse.json({ watchedVideoIds: views.map((v) => v.videoId) });
}
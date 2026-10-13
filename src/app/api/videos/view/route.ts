import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { findCourseContent } from "@/data/courses";
import { listVideoViews, recordVideoView } from "@/lib/websiteUsers";

const TRIAL_DAYS = 3;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { courseId, videoId } = await req.json().catch(() => ({}));

  if (typeof courseId !== "string" || typeof videoId !== "string" || !courseId || !videoId) {
    return NextResponse.json({ error: "courseId and videoId are required" }, { status: 400 });
  }

  // Only the course's own free preview videos are tracked
  const isPreview = findCourseContent(courseId)?.freeVideos?.some((v) => v.id === videoId);
  if (!isPreview) {
    return NextResponse.json({ error: "Unknown preview video" }, { status: 400 });
  }

  // The trial starts with the first preview watched in this course
  const existingViews = await listVideoViews(userId, courseId);
  if (existingViews.length > 0) {
    const trialExpiry = new Date(existingViews[0].viewedAt);
    trialExpiry.setDate(trialExpiry.getDate() + TRIAL_DAYS);
    if (new Date() > trialExpiry) {
      return NextResponse.json({ error: "Free trial period has expired" }, { status: 403 });
    }
  }

  const result = await recordVideoView(userId, courseId, videoId);
  if (result.status !== "ok") {
    return NextResponse.json({ error: "Could not record the view. Please try again." }, { status: 503 });
  }
  return NextResponse.json({ watchedVideoIds: result.data.map((v) => v.videoId) });
}

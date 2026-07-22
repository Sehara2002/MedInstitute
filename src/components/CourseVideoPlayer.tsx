"use client";
import { useState } from "react";
import Link from "next/link";
import { Course } from "@/data/courses";
import { GlassCard } from "@/components/GlassCard";
import { PlayCircle, CheckCircle2, ArrowLeft, Lock, VideoOff, Clock, Sparkles } from "lucide-react";

interface Props {
  course: Course;
  initialWatchedIds: string[];
  trialExpiresAt: string | null;
  isTrialExpired: boolean;
}

export function CourseVideoPlayer({
  course,
  initialWatchedIds,
  trialExpiresAt,
  isTrialExpired,
}: Props) {
  const videos = course.freeVideos || [];
  const [watchedIds, setWatchedIds] = useState<string[]>(initialWatchedIds);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(videos[0]?.id || null);
  const [trialExpired, setTrialExpired] = useState(isTrialExpired);

  const activeVideo = videos.find((v) => v.id === activeVideoId);
  const allWatched = videos.length > 0 && videos.every((v) => watchedIds.includes(v.id));

  async function markWatched(videoId: string) {
    try {
      const res = await fetch("/api/videos/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id, videoId }),
      });

      if (res.status === 403) {
        setTrialExpired(true);
        return;
      }

      const data = await res.json();
      if (data?.watchedVideoIds) {
        setWatchedIds(data.watchedVideoIds);
      }
    } catch (err) {
      console.error("[CourseVideoPlayer] Failed to record view:", err);
    }
  }

  const daysLeft = trialExpiresAt
    ? Math.max(0, Math.ceil((new Date(trialExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  if (videos.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-medical-green-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{course.title}</h1>
        <GlassCard className="p-10 text-center" variant="panel">
          <VideoOff className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">Preview videos aren't available yet</p>
          <p className="text-sm text-gray-500 mb-6">
            Check back soon, or register now to be notified when they're ready.
          </p>
          <Link
            href={`/register?id=${encodeURIComponent(course.id)}&amount=${encodeURIComponent(String(course.fee || ""))}`}
            className="inline-block px-6 py-2.5 rounded-xl bg-medical-green-600 text-white font-semibold hover:bg-medical-green-500 transition-colors"
          >
            Register for Full Course
          </Link>
        </GlassCard>
      </div>
    );
  }

  if (trialExpired) {
    return (
      <div className="max-w-3xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-medical-green-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{course.title}</h1>
        <GlassCard className="p-10 text-center bg-medical-green-50/60" variant="panel">
          <Lock className="h-10 w-10 text-medical-green-600 mx-auto mb-4" />
          <p className="text-gray-900 font-semibold text-lg mb-2">Your free preview period has ended</p>
          <p className="text-sm text-gray-600 mb-6">
            Register now to get full, unlimited access to this course.
          </p>
          <Link
            href={`/register?id=${encodeURIComponent(course.id)}&amount=${encodeURIComponent(String(course.fee || ""))}`}
            className="inline-block px-6 py-2.5 rounded-xl bg-medical-green-600 text-white font-semibold hover:bg-medical-green-500 transition-colors"
          >
            Register for Full Course
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-medical-green-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <p className="text-gray-600">
          Free preview videos — {watchedIds.length} / {videos.length} watched
        </p>
        {daysLeft !== null && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-medical-blue-100 text-medical-blue-700 text-xs font-semibold">
            <Clock className="h-3.5 w-3.5" />
            {daysLeft === 0 ? "Expires today" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left in free trial`}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <GlassCard className="p-4" variant="panel">
            {activeVideo ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
                <iframe
                  key={activeVideo.id}
                  src={`https://player.vimeo.com/video/${activeVideo.vimeoId}`}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  onLoad={() => markWatched(activeVideo.id)}
                />
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center text-gray-400">
                Select a video to begin
              </div>
            )}
            {activeVideo && (
              <h3 className="mt-4 font-semibold text-gray-900">{activeVideo.title}</h3>
            )}
          </GlassCard>
        </div>

        <div className="space-y-4">
          {videos.map((video, i) => {
            const isWatched = watchedIds.includes(video.id);
            const isActive = video.id === activeVideoId;
            return (
              <button
                key={video.id}
                onClick={() => setActiveVideoId(video.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-colors ${
                  isActive
                    ? "bg-medical-green-100 ring-2 ring-medical-green-400"
                    : "bg-white/60 hover:bg-white"
                }`}
              >
                {isWatched ? (
                  <CheckCircle2 className="h-5 w-5 text-medical-green-600 flex-shrink-0" />
                ) : (
                  <PlayCircle className="h-5 w-5 text-medical-blue-600 flex-shrink-0" />
                )}
                <div>
                  <p className="text-xs text-gray-500">Video {i + 1}</p>
                  <p className="font-medium text-gray-900 text-sm">{video.title}</p>
                </div>
              </button>
            );
          })}

          {/* Register prompt — shows once all free videos are watched, but doesn't block continued access during the trial */}
          {allWatched && (
            <GlassCard className="p-6 text-center bg-medical-green-50/60" variant="panel">
              <Sparkles className="h-8 w-8 text-medical-green-600 mx-auto mb-3" />
              <p className="font-semibold text-gray-900 mb-1">Ready for more?</p>
              <p className="text-sm text-gray-600 mb-4">
                You've watched all the free previews. Register now to unlock the full course
                {daysLeft !== null && daysLeft > 0
                  ? ` — or keep rewatching these for ${daysLeft} more day${daysLeft === 1 ? "" : "s"}.`
                  : "."}
              </p>
              <Link
                href={`/register?id=${encodeURIComponent(course.id)}&amount=${encodeURIComponent(String(course.fee || ""))}`}
                className="block w-full py-3 rounded-xl bg-medical-green-600 text-white font-semibold hover:bg-medical-green-500 transition-colors"
              >
                Register for Full Course
              </Link>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
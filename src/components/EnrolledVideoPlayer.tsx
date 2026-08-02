"use client";
import { useState } from "react";
import Link from "next/link";
import { Course } from "@/data/courses";
import { GlassCard } from "@/components/GlassCard";
import { PlayCircle, ArrowLeft, ShieldAlert } from "lucide-react";
import { ProtectedVimeoPlayer } from "@/components/ProtectedVimeoPlayer";

interface Props {
  course: Course;
  studentEmail: string;
  studentName: string;
}

export function EnrolledVideoPlayer({ course, studentEmail, studentName }: Props) {
  const videos = course.fullVideos || [];
  const [activeId, setActiveId] = useState<string | null>(videos[0]?.id || null);
  const activeVideo = videos.find((v) => v.id === activeId);

  if (videos.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <Link
          href="/dashboard/my-courses"
          className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-medical-green-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to My Courses
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{course.title}</h1>
        <GlassCard className="p-10 text-center" variant="panel">
          <p className="text-gray-700 font-medium">Course videos aren't available yet. Check back soon.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        href="/dashboard/my-courses"
        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-medical-green-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to My Courses
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
      <p className="text-gray-600 mb-6">Full course access — {videos.length} videos</p>

      <div className="flex items-start gap-2 mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
        <ShieldAlert className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <span>
          This content is licensed personally to {studentName} ({studentEmail}). Downloading, sharing,
          or recording is strictly prohibited and may result in account suspension.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <GlassCard className="p-4" variant="panel">
            {activeVideo ? (
              <ProtectedVimeoPlayer key={activeVideo.id} vimeoId={activeVideo.vimeoId} studentEmail={studentEmail} />
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

        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {videos.map((video, i) => {
            const isActive = video.id === activeId;
            return (
              <button
                key={video.id}
                onClick={() => setActiveId(video.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-colors ${
                  isActive
                    ? "bg-medical-green-100 ring-2 ring-medical-green-400"
                    : "bg-white/60 hover:bg-white"
                }`}
              >
                <PlayCircle className="h-5 w-5 text-medical-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Video {i + 1}</p>
                  <p className="font-medium text-gray-900 text-sm">{video.title}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
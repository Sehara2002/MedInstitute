import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { courses } from "@/data/courses";
import { GlassCard } from "@/components/GlassCard";
import Link from "next/link";
import { PlayCircle, BookOpen } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const [views, paidRegistrations] = await Promise.all([
    prisma.videoView.findMany({ where: { userId }, select: { courseId: true, videoId: true } }),
    prisma.registration.findMany({ where: { userId, status: "paid" } }),
  ]);

  const watchedByCourse: Record<string, string[]> = {};
  for (const v of views) {
    if (!watchedByCourse[v.courseId]) watchedByCourse[v.courseId] = [];
    watchedByCourse[v.courseId].push(v.videoId);
  }

  const enrolledCourseIds = new Set(
    paidRegistrations.map((r) => r.courseId).filter((id): id is string => !!id)
  );
  const enrolledCourses = courses.filter((c) => enrolledCourseIds.has(c.id));
  const nonEnrolledCourses = courses.filter((c) => !enrolledCourseIds.has(c.id));

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {session!.user!.name?.split(" ")[0] || "Student"} 👋
        </h1>
        <p className="text-gray-600">
          Your enrolled courses are ready below. Explore free previews for anything you haven't enrolled in yet.
        </p>
      </div>

      {enrolledCourses.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-medical-green-600" />
            My Enrolled Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <GlassCard key={course.id} className="p-6 flex flex-col" variant="panel">
                <div className={`h-2 w-16 rounded-full mb-4 ${course.imageUrl}`} />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{course.description}</p>
                <Link
                  href={`/dashboard/enrolled/${course.id}`}
                  className="text-center py-2.5 rounded-xl bg-medical-green-600 text-white font-semibold hover:bg-medical-green-500 transition-colors"
                >
                  Watch Course Videos
                </Link>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Free Preview Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {nonEnrolledCourses.map((course) => {
            const totalFree = course.freeVideos?.length || 0;
            const watchedCount = watchedByCourse[course.id]?.length || 0;

            return (
              <GlassCard key={course.id} className="p-6 flex flex-col" variant="panel">
                <div className={`h-2 w-16 rounded-full mb-4 ${course.imageUrl}`} />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{course.description}</p>

                {totalFree > 0 ? (
                  <>
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-700">
                      <PlayCircle className="h-4 w-4 text-medical-blue-600" />
                      <span>{watchedCount} / {totalFree} free videos watched</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-gray-200 mb-4 overflow-hidden">
                      <div
                        className="h-full bg-medical-green-500 transition-all"
                        style={{ width: `${(watchedCount / totalFree) * 100}%` }}
                      />
                    </div>
                    <Link
                      href={`/dashboard/courses/${course.id}`}
                      className="text-center py-2.5 rounded-xl bg-white border-2 border-medical-green-600 text-medical-green-700 font-semibold hover:bg-medical-green-50 transition-colors"
                    >
                      {watchedCount > 0 ? "Continue Watching" : "Watch Free Videos"}
                    </Link>
                  </>
                ) : (
                  <Link
                    href={`/register?id=${encodeURIComponent(course.id)}&amount=${encodeURIComponent(String(course.fee || ""))}`}
                    className="text-center py-2.5 rounded-xl bg-medical-green-600 text-white font-semibold hover:bg-medical-green-500 transition-colors"
                  >
                    Register for This Course
                  </Link>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </>
  );
}
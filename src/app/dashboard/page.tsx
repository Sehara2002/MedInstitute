import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { accessCourseIds } from "@/data/courses";
import { listCourses } from "@/lib/citech";
import { listPaidCourses } from "@/lib/paidCourses";
import { GlassCard } from "@/components/GlassCard";
import { OfferCard } from "@/components/OfferCard";
import Link from "next/link";
import { PlayCircle, BookOpen, Gift } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const [views, paidRegistrations, catalogue] = await Promise.all([
    prisma.videoView.findMany({ where: { userId }, select: { courseId: true, videoId: true } }),
    listPaidCourses(userId),
    listCourses(),
  ]);

  const watchedByCourse: Record<string, string[]> = {};
  for (const v of views) {
    if (!watchedByCourse[v.courseId]) watchedByCourse[v.courseId] = [];
    watchedByCourse[v.courseId].push(v.videoId);
  }

  const paidCourseIds = new Set(
    paidRegistrations.map((r) => r.courseId).filter((id): id is string => !!id)
  );
  const courses = catalogue?.filter((c) => !c.isFree) ?? [];
  const offers = catalogue?.filter((c) => c.isFree) ?? [];
  const isEnrolled = (courseId: string) => accessCourseIds(courseId).some((id) => paidCourseIds.has(id));
  const enrolledCourses = courses.filter((c) => isEnrolled(c.id));
  const nonEnrolledCourses = courses.filter((c) => !isEnrolled(c.id));

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

      {catalogue === null && (
        <GlassCard className="p-6 mb-10 text-sm text-gray-700" variant="panel">
          Our course list is temporarily unavailable. Your purchased courses are always available under{" "}
          <Link href="/dashboard/my-courses" className="font-semibold text-medical-green-700 hover:underline">
            My Courses
          </Link>
          .
        </GlassCard>
      )}

      {offers.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Gift className="h-5 w-5 text-red-500" />
            Free Offers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <OfferCard key={offer.id} course={offer} />
            ))}
          </div>
        </div>
      )}

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

      {nonEnrolledCourses.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Free Preview Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {nonEnrolledCourses.map((course) => {
              const totalFree = course.freeVideos.length;
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
                      href={course.acceptsOnlinePayment ? `/register?id=${encodeURIComponent(course.id)}` : `/courses/${course.id}`}
                      className="text-center py-2.5 rounded-xl bg-medical-green-600 text-white font-semibold hover:bg-medical-green-500 transition-colors"
                    >
                      {course.acceptsOnlinePayment ? "Register for This Course" : "View Course"}
                    </Link>
                  )}
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

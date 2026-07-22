import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { courses } from "@/data/courses";
import { GlassCard } from "@/components/GlassCard";
import Link from "next/link";
import { BookOpen, Download } from "lucide-react";

export default async function MyCoursesPage() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const paidRegistrations = await prisma.registration.findMany({
    where: { userId, status: "paid" },
    orderBy: { paidAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
      <p className="text-gray-600 mb-8">Courses you've enrolled in and paid for.</p>

      {paidRegistrations.length === 0 ? (
        <GlassCard className="p-10 text-center" variant="panel">
          <BookOpen className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">No enrolled courses yet</p>
          <p className="text-sm text-gray-500 mb-6">
            Watch the free preview videos on your dashboard, then register to unlock full access.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-2.5 rounded-xl bg-medical-green-600 text-white font-semibold hover:bg-medical-green-500 transition-colors"
          >
            Go to Dashboard
          </Link>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paidRegistrations.map((reg) => {
            const course = courses.find((c) => c.id === reg.courseId);
            return (
              <GlassCard key={reg.id} className="p-6" variant="panel">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {course?.title || reg.course}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Enrolled {reg.paidAt ? new Date(reg.paidAt).toLocaleDateString() : ""}
                </p>
                {course?.brochures?.map((b, i) => (
                  <a
                    key={i}
                    href={b.url}
                    download
                    className="flex items-center gap-2 text-sm font-medium text-medical-green-700 hover:underline mb-2"
                  >
                    <Download className="h-4 w-4" />
                    {b.label}
                  </a>
                ))}
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { courses } from "@/data/courses";
import { EnrolledVideoPlayer } from "@/components/EnrolledVideoPlayer";

interface PageProps {
  params: { id: string };
}

export default async function EnrolledCoursePage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const course = courses.find((c) => c.id === id);
  if (!course) {
    notFound();
  }

  const paidRegistration = await prisma.registration.findFirst({
    where: { userId, courseId: id, status: "paid" },
  });

  if (!paidRegistration) {
    redirect(`/register?id=${encodeURIComponent(id)}&amount=${encodeURIComponent(String(course.fee || ""))}`);
  }

  return (
    <EnrolledVideoPlayer
      course={course}
      studentEmail={session!.user!.email || ""}
      studentName={session!.user!.name || "Student"}
    />
  );
}
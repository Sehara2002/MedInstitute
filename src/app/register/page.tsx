import Link from "next/link";
import { redirect } from "next/navigation";
import { GlassCard } from "@/components/GlassCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { parseCourseId } from "@/data/courses";
import { exams } from "@/data/exams";
import { getCourse } from "@/lib/citech";
import { parsePriceToNumber } from "@/lib/price";
import { RegisterForm, type RegisterItem } from "./RegisterForm";

interface PageProps {
  searchParams: Promise<{ id?: string | string[] }>;
}

type Resolved = { item: RegisterItem | null } | { notice: string };

async function resolveItem(id: string): Promise<Resolved> {
  if (parseCourseId(id) !== null) {
    const lookup = await getCourse(id);
    if (lookup.status === "unavailable") {
      return { notice: "Registration for this course is temporarily unavailable. Please try again in a few minutes." };
    }
    if (lookup.status === "not_found") {
      return { notice: "This course is no longer open for registration." };
    }
    const course = lookup.course;
    if (course.isFree) redirect(`/courses/${course.id}`);
    if (!course.acceptsOnlinePayment) {
      return { notice: "Online payment isn't available for this course yet. Please contact us to enroll." };
    }
    return { item: { id: course.id, title: course.title, options: course.fees } };
  }

  const exam = exams.find((e) => e.id === id);
  if (exam) {
    const amount = parsePriceToNumber(exam.fee);
    return {
      item: {
        id: exam.id,
        title: exam.title,
        options: amount !== null ? [{ key: "FEE", label: "Fee", display: exam.fee, amount }] : [],
      },
    };
  }

  return { item: null };
}

export default async function RegisterPage({ searchParams }: PageProps) {
  const { id } = await searchParams;
  const resolved = await resolveItem(typeof id === "string" ? id : "");

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        {"notice" in resolved ? (
          <GlassCard className="p-10 text-center max-w-xl" variant="panel">
            <p className="text-gray-900 font-semibold mb-6">{resolved.notice}</p>
            <Link
              href="/contact"
              className="inline-block px-6 py-2.5 rounded-xl bg-medical-green-600 text-white font-semibold hover:bg-medical-green-500 transition-colors"
            >
              Contact Us
            </Link>
          </GlassCard>
        ) : (
          <RegisterForm item={resolved.item} />
        )}
      </main>
      <Footer />
    </>
  );
}

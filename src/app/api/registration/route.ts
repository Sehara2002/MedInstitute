import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { parseCourseId } from "@/data/courses";
import { exams } from "@/data/exams";
import { getCourse } from "@/lib/citech";
import { parsePriceToNumber } from "@/lib/price";
import { auth } from "@/auth";

type Priced = { course: string; courseId?: string; amount: number } | { error: string; status: number };

/**
 * Price a CITech course from the live catalogue. Only the option key comes
 * from the client; the title and amount are always the catalogue's own.
 */
async function priceCitechCourse(courseId: string, feeKey: unknown): Promise<Priced> {
  const lookup = await getCourse(courseId, { fresh: true });
  if (lookup.status === "unavailable") {
    return { error: "Course details are temporarily unavailable. Please try again shortly.", status: 503 };
  }
  if (lookup.status === "not_found") {
    return { error: "This course is no longer open for registration", status: 404 };
  }

  const found = lookup.course;
  if (found.isFree) {
    return { error: "This is a free course and needs no registration here", status: 400 };
  }
  if (!found.acceptsOnlinePayment) {
    return { error: "Online payment isn't available for this course. Please contact us to enroll.", status: 400 };
  }

  const fee = found.fees.length === 1 ? found.fees[0] : found.fees.find((f) => f.key === feeKey);
  if (!fee) {
    return { error: "Please select a valid mode of delivery", status: 400 };
  }

  return {
    course: found.fees.length > 1 ? `${found.title} (${fee.label})` : found.title,
    courseId: found.id,
    amount: fee.amount,
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { firstName, lastName, email, phone, courseId, feeKey } = body;

  if (!firstName?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "First name and email are required" }, { status: 400 });
  }

  let priced: Priced;

  if (typeof courseId === "string" && parseCourseId(courseId) !== null) {
    priced = await priceCitechCourse(courseId, feeKey);
  } else {
    const found = exams.find((e) => e.id === courseId);
    if (found) {
      priced = { course: found.title, courseId: found.id, amount: parsePriceToNumber(found.fee) || 0 };
    } else if (body.course && typeof body.course === "string" && typeof body.amount === "number") {
      // A free-form payment: it is never linked to a course, so it cannot unlock course content
      priced = { course: body.course, amount: body.amount };
    } else {
      priced = { course: "", amount: 0 };
    }
  }

  if ("error" in priced) {
    return NextResponse.json({ error: priced.error }, { status: priced.status });
  }
  if (!(priced.amount > 0)) {
    return NextResponse.json({ error: "Could not determine a valid amount for this item" }, { status: 400 });
  }

  const session = await auth();
  const userId = session?.user ? (session.user as { id: string }).id : undefined;

  const registration = await store.create({
    firstName,
    lastName,
    email,
    phone,
    course: priced.course,
    courseId: priced.courseId,
    amount: priced.amount,
    userId,
  });

  return NextResponse.json({ registration });
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const registration = await store.get(id);
  if (!registration) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ registration });
}

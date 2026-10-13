import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { parseCourseId } from "@/data/courses";
import { priceCitechCourse } from "@/lib/coursePrice";
import { auth } from "@/auth";
import { sendPayLaterEmail } from "@/lib/mailer";

// The amount of a CITech course comes from the live catalogue (the offer price while an
// offer runs); see src/lib/coursePrice.ts
type Priced = { course: string; courseId?: string; amount: number } | { error: string; status: number };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id: existingRegId,
      firstName,
      lastName,
      email,
      phone,
      dob,
      country,
      address,
      password,
      courseId,
      feeKey,
      sendPayLater = true,
    } = body;

    if (!firstName?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "First name and email are required" }, { status: 400 });
    }

    // If password is not provided (deferred), auto-generate a secure random temporary password for central LMS backend sync
    const effectivePassword =
      password && typeof password === "string" && password.trim().length >= 8
        ? password.trim()
        : `Mrcgp@${Math.random().toString(36).slice(2, 8)}${Date.now().toString().slice(-4)}!`;

    let lmsStudentCode: string | null = null;

    let priced: Priced;

    // Course registrations only; mock exams are booked through the LMS backend (/exams)
    if (typeof courseId === "string" && parseCourseId(courseId) !== null) {
      const result = await priceCitechCourse(courseId, feeKey);
      priced = "error" in result ? result : { course: result.course, courseId: result.courseId, amount: result.amount };
    } else if (body.course && typeof body.course === "string" && typeof body.amount === "number") {
      // A free-form payment: it is never linked to a course, so it cannot unlock course content
      priced = { course: body.course, amount: body.amount };
    } else {
      priced = { course: "", amount: 0 };
    }

    if ("error" in priced) {
      return NextResponse.json({ error: priced.error }, { status: priced.status });
    }
    if (!(priced.amount > 0)) {
      return NextResponse.json({ error: "Could not determine a valid amount for this item" }, { status: 400 });
    }

    const { course, amount } = priced;

    // Helper to map MedInstitute courses to central LMS backend course IDs
    function resolveBackendCourseId(title: string, courseIdParam?: string): number {
      const t = (title || "").toLowerCase();
      const c = (courseIdParam || "").toLowerCase();

      if (t.includes("chennai") || c.includes("chennai")) return 5;
      if (t.includes("mock") || c.includes("mock")) return 98;
      if (t.includes("package") || c.includes("package")) return 4;
      if (t.includes("osce") || c.includes("osce")) return 84;
      if (t.includes("akt") || c.includes("akt")) return 3;
      if (t.includes("screening") || c.includes("dfm") || c.includes("pg-exams")) return 7;
      if (t.includes("individual") || c.includes("individual")) return 8;
      return 1;
    }

    // 1. Verify if candidate email already exists in registration store (active paid registration)
    const normalizedEmail = email.trim().toLowerCase();
    const existingPaid = await store.findPaidByEmail(normalizedEmail);
    if (existingPaid) {
      return NextResponse.json(
        { error: "An account with this email address already exists and is registered. Please sign in to the portal." },
        { status: 409 }
      );
    }

    // 2. Verify if candidate email already exists in Central LMS Backend (PostgreSQL)
    const lmsBackendUrl = process.env.LMS_BACKEND_URL || "http://localhost:5000/api";
    try {
      const checkRes = await fetch(`${lmsBackendUrl}/students/check-email?email=${encodeURIComponent(normalizedEmail)}`);
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.exists) {
          return NextResponse.json(
            { error: "An account with this email address already exists. Please use another email or sign in to your LMS portal." },
            { status: 409 }
          );
        }
      }
    } catch (lmsErr) {
      console.warn("[LMS Check Email] Could not reach LMS backend, continuing:", lmsErr);
    }

    // 3. Persist in MedInstitute VPS Database for MPGS Checkout tracking
    const session = await auth();
    const userId = session?.user ? (session.user as { id: string }).id : undefined;

    let registration: any = null;
    if (existingRegId && typeof existingRegId === "string") {
      try {
        const existing = await store.get(existingRegId);
        if (existing && existing.status !== "paid") {
          registration = await store.update(existingRegId, {
            firstName: firstName.trim(),
            lastName: lastName?.trim() || "",
            email: email.trim().toLowerCase(),
            phone: phone?.trim() || "",
            course,
            courseId: priced.courseId,
            amount,
            userId: userId || null,
          });
        }
      } catch (updateErr) {
        console.warn("[Registration API] Could not update existing registration, will create new:", updateErr);
      }
    }

    if (!registration) {
      registration = await store.create({
        firstName: firstName.trim(),
        lastName: lastName?.trim() || "",
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || "",
        course,
        courseId: priced.courseId,
        amount,
        userId,
      });
    }

    // 4. Send Pay Later email matching requested template
    if (sendPayLater && registration) {
      try {
        await sendPayLaterEmail({
          to: registration.email,
          fullName: `${registration.firstName} ${registration.lastName}`.trim(),
          courseName: registration.course,
          amount: registration.amount,
          registrationId: registration.id,
        });
      } catch (mailErr) {
        console.error("[Registration API] Failed to send pay later email:", mailErr);
      }
    }

    return NextResponse.json({
      registration,
      studentCode: lmsStudentCode,
    });
  } catch (error: any) {
    console.error("[Registration API] Unexpected error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const registration = await store.get(id);
  if (!registration) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ registration });
}

import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { courses } from "@/data/courses";
import { parsePriceToNumber } from "@/lib/price";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      dob,
      country,
      address,
      password,
      courseId,
      mode,
    } = body;

    if (!firstName?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "First name and email are required" }, { status: 400 });
    }

    // If password is not provided (deferred), auto-generate a secure random temporary password for central LMS backend sync
    const effectivePassword =
      password && typeof password === "string" && password.trim().length >= 8
        ? password.trim()
        : `Mrcgp@${Math.random().toString(36).slice(2, 8)}${Date.now().toString().slice(-4)}!`;

    let course = "";
    let amount = 0;
    let lmsStudentCode: string | null = null;

  // Course registrations only; mock exams are booked through the LMS backend (/exams)
  const found = courses.find((c) => c.id === courseId);

    if (found) {
      course = found.title;

      if ("modePricing" in found && found.modePricing && found.modePricing.length > 0) {
        const allowedAmounts = found.modePricing
          .map((opt) => parsePriceToNumber(opt.fee))
          .filter((n): n is number => n !== null);

        if (typeof body.amount === "number" && allowedAmounts.includes(body.amount)) {
          amount = body.amount;
        } else {
          amount = allowedAmounts[0] || 0;
        }

        if (body.course && typeof body.course === "string") {
          course = body.course;
        }
      } else {
        amount = parsePriceToNumber(found.fee) || 0;
      }
    } else if (body.course && typeof body.amount === "number") {
      course = body.course;
      amount = body.amount;
    }

    if (amount <= 0) {
      return NextResponse.json({ error: "Could not determine a valid amount for this item" }, { status: 400 });
    }

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

    const registration = await store.create({
      firstName: firstName.trim(),
      lastName: lastName?.trim() || "",
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      course,
      courseId: found?.id || courseId,
      amount,
      userId,
    });

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
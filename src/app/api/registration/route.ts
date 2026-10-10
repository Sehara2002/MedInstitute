import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { courses } from "@/data/courses";
import { exams } from "@/data/exams";
import { getMockExamById } from "@/lib/exams";
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

    const found = courses.find((c) => c.id === courseId) || exams.find((e) => e.id === courseId);

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
    function resolveBackendCourseId(title: string, courseIdParam?: string): number | undefined {
      const t = (title || "").toLowerCase();
      const c = (courseIdParam || "").toLowerCase();

      if (t.includes("osce") || c.includes("osce")) return 84;
      if (t.includes("mock") || c.includes("mock")) return 98;
      if (t.includes("rca") || c.includes("rca")) return 4;
      if (t.includes("akt") || c.includes("akt")) return 3;
      if (t.includes("prep") || c.includes("complete")) return 1;
      return undefined;
    }

    // 1. Sync student to Central LMS Backend (PostgreSQL)
    const lmsBackendUrl = process.env.LMS_BACKEND_URL || "http://localhost:5000/api";
    let lmsStudentCode: string | undefined;

    try {
      const team = mode?.toLowerCase().includes("physical") ? "PHYSICAL_GROUP" : "ONLINE_GROUP";
      const backendCourseId = resolveBackendCourseId(course, found?.id || courseId);

      const lmsPayload = {
        fullName: `${firstName.trim()} ${lastName?.trim() || ""}`.trim(),
        email: email.trim().toLowerCase(),
        password: effectivePassword,
        phone: phone?.trim() || null,
        dob: dob || null,
        address: address?.trim() || null,
        country: country?.trim() || null,
        team,
        courseId: backendCourseId,
      };

      console.log("[LMS Backend Sync] Sending registration to:", `${lmsBackendUrl}/students/register`, lmsPayload);
      const lmsRes = await fetch(`${lmsBackendUrl}/students/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lmsPayload),
      });

      const lmsData = await lmsRes.json();
      console.log("[LMS Backend Sync] Status:", lmsRes.status, "Response:", lmsData);

      if (lmsRes.ok && lmsData?.data?.student?.studentCode) {
        lmsStudentCode = lmsData.data.student.studentCode;
      } else if (lmsRes.status === 409) {
        return NextResponse.json(
          { error: "An account with this email address already exists. Please use another email or sign in." },
          { status: 409 }
        );
      } else if (!lmsRes.ok) {
        return NextResponse.json(
          { error: lmsData?.message || "Failed to register student in LMS backend." },
          { status: lmsRes.status || 400 }
        );
      }
    } catch (lmsErr) {
      console.error("[LMS Backend Sync] Could not reach LMS backend:", lmsErr);
      return NextResponse.json(
        { error: "Could not connect to LMS backend server. Please verify the backend service is running." },
        { status: 503 }
      );
    }

    // 2. Persist in MedInstitute Neon Database for MPGS Checkout tracking
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
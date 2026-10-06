import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { courses } from "@/data/courses";
import { exams } from "@/data/exams";
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

    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

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

    // 1. Sync student to Central LMS Backend (PostgreSQL)
    const lmsBackendUrl = process.env.LMS_BACKEND_URL || "http://localhost:5000/api";
    let lmsStudentCode: string | undefined;

    try {
      const team = mode?.toLowerCase().includes("physical") ? "PHYSICAL_GROUP" : "ONLINE_GROUP";
      const lmsPayload = {
        fullName: `${firstName.trim()} ${lastName?.trim() || ""}`.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        phone: phone?.trim() || null,
        dob: dob || null,
        address: address?.trim() || null,
        country: country?.trim() || null,
        team,
      };

      console.log("[LMS Backend Sync] Sending registration to:", `${lmsBackendUrl}/students/register`);
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
        console.log("[LMS Backend Sync] Account with email already exists in LMS backend.");
      } else {
        console.warn("[LMS Backend Sync] Non-fatal LMS registration response:", lmsData?.message);
      }
    } catch (lmsErr) {
      console.error("[LMS Backend Sync] Could not reach LMS backend:", lmsErr);
      // Non-fatal: Allow local registration & MPGS checkout to proceed so payment is never blocked
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
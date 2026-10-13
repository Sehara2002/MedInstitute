import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { lmsFetch } from "@/lib/lms";
import { errorFrom, isReference, toRegistration, type BackendRegistration } from "@/lib/registrations";

// Course registrations are saved, priced and emailed by the LMS backend. The
// amount is always the backend's own (the offer price while one runs); the
// browser only chooses the course and its study option.

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // The signed-in website account, so its dashboard can unlock the course once paid
  const session = await auth();
  const websiteUserId = session?.user ? (session.user as { id?: string }).id ?? null : null;

  const result = await lmsFetch<BackendRegistration>("/public/course-registrations", {
    method: "POST",
    body: {
      courseId: body.courseId,
      feeKey: body.feeKey,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      dob: body.dob || undefined,
      country: body.country,
      address: body.address,
      // Coming back to the form updates the earlier, unpaid registration
      reference: isReference(body.id) ? body.id : undefined,
      // The "pay now" email goes out once, when the details are first saved
      sendPaymentEmail: body.sendPayLater !== false,
      websiteUserId,
    },
  });

  if (result.status !== "ok") {
    const { error, status } = errorFrom(result);
    return NextResponse.json({ error }, { status });
  }
  return NextResponse.json({ registration: toRegistration(result.data) });
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!isReference(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const result = await lmsFetch<BackendRegistration>(`/public/course-registrations/${id}`);
  if (result.status !== "ok") {
    const { error, status } = errorFrom(result);
    return NextResponse.json({ error }, { status });
  }
  return NextResponse.json({ registration: toRegistration(result.data) });
}

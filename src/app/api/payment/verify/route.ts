import { NextRequest, NextResponse } from "next/server";
import { lmsFetch } from "@/lib/lms";
import { errorFrom, isReference, toRegistration, type BackendRegistration } from "@/lib/registrations";

// Called when the student comes back from the payment page. The LMS backend asks
// the gateway whether the order was paid and, if so, creates (or links) the
// student's LMS account, enrolls them and emails their access details.

interface Verified {
  registration: BackendRegistration;
  isPaid: boolean;
  alreadyExists: boolean;
}

export async function GET(req: NextRequest) {
  const regId = req.nextUrl.searchParams.get("regId");
  if (!isReference(regId)) {
    return NextResponse.json({ error: "Missing regId" }, { status: 400 });
  }

  const result = await lmsFetch<Verified>(`/public/course-registrations/${regId}/verify`, { method: "POST" });
  if (result.status !== "ok") {
    const { error, status } = errorFrom(result);
    return NextResponse.json({ error }, { status });
  }

  const { registration, isPaid, alreadyExists } = result.data;
  return NextResponse.json({
    status: isPaid ? "CAPTURED" : registration.status,
    isPaid,
    alreadyExists,
    registration: toRegistration(registration),
  });
}

import { NextRequest, NextResponse } from "next/server";
import { lmsFetch } from "@/lib/lms";
import { errorFrom, isReference, toRegistration, type BackendRegistration } from "@/lib/registrations";

// Starts a Commercial Bank (MPGS) checkout for a course registration. The LMS
// backend re-checks the price first (a limited-time offer may have ended since
// the student registered) and creates the gateway session; the gateway sends the
// student back to /register/summary/result?regId=<reference>.

interface Checkout {
  sessionId: string;
  checkoutScriptUrl: string;
  registration: BackendRegistration;
}

export async function POST(req: NextRequest) {
  const { registrationId } = await req.json().catch(() => ({}));
  if (!isReference(registrationId)) {
    return NextResponse.json({ error: "Missing registrationId" }, { status: 400 });
  }

  const result = await lmsFetch<Checkout>(`/public/course-registrations/${registrationId}/checkout`, {
    method: "POST",
    body: { returnUrl: `${req.nextUrl.origin}/register/summary/result` },
  });

  if (result.status === "error" && result.body?.priceChanged === true) {
    // The new amount is saved; the student reviews it before paying
    return NextResponse.json(
      {
        error: result.message,
        priceChanged: true,
        previousAmount: result.body.previousAmount,
        registration: toRegistration(result.body.data as BackendRegistration),
      },
      { status: 409 }
    );
  }
  if (result.status !== "ok") {
    const { error, status } = errorFrom(result);
    return NextResponse.json({ error }, { status });
  }

  const { sessionId, checkoutScriptUrl, registration } = result.data;
  return NextResponse.json({
    session: { id: sessionId },
    checkoutScriptUrl,
    orderId: registration.orderId,
    amount: registration.amount,
  });
}

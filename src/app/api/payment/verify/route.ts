import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { sendStudentWelcomeEmail, sendPaymentNotification } from "@/lib/mailer";

async function dispatchLmsCredentials(registration: any) {
  const lmsBackendUrl = process.env.NEXT_PUBLIC_LMS_API_URL || "http://localhost:5000/api";
  try {
    const lmsRes = await fetch(`${lmsBackendUrl}/students/complete-payment-credentials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: registration.email,
        fullName: `${registration.firstName} ${registration.lastName}`.trim(),
        courseName: registration.course,
        phone: registration.phone,
        orderId: registration.orderId,
      }),
    });
    const lmsData = await lmsRes.json();
    console.log("[LMS Credentials Dispatch] Status:", lmsRes.status, "Response:", lmsData);

    // If the student already exists in LMS: do NOT send any fallback email, inform caller
    if (lmsData?.data?.alreadyExists) {
      console.log("[LMS Credentials Dispatch] Student already exists in LMS. No email sent.");
      return { alreadyExists: true, message: lmsData.data.message };
    }

    if (lmsRes.ok && lmsData?.data?.emailDelivery?.sent) {
      return { alreadyExists: false, ...lmsData.data };
    }
  } catch (err) {
    console.warn("[LMS Credentials Dispatch] Could not contact LMS backend:", err);
  }

  return { alreadyExists: false };
}

export async function GET(req: NextRequest) {
  const regId = req.nextUrl.searchParams.get("regId");
  const testMode = req.nextUrl.searchParams.get("testMode");
  if (!regId) {
    return NextResponse.json({ error: "Missing regId" }, { status: 400 });
  }

  const registration = await store.get(regId);
  if (!registration) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  // Bypass for testing mode
  if (testMode === "true" || testMode === "1") {
    const updatedRegistration = await store.update(regId, {
      status: "paid",
      orderId: registration.orderId || `TEST-ORDER-${Date.now()}`,
      paidAt: new Date(),
    });

    // Notify institute admin of payment
    try {
      await sendPaymentNotification(updatedRegistration);
    } catch (err) {
      console.warn("[mailer] Could not send admin payment notification:", err);
    }

    // Dispatch credentials onboarding email ONLY if student is new (not existing)
    const credResult = await dispatchLmsCredentials(updatedRegistration);

    return NextResponse.json({
      status: "CAPTURED",
      isPaid: true,
      testMode: true,
      alreadyExists: Boolean(credResult?.alreadyExists),
      registration: updatedRegistration,
    });
  }

  if (!registration.orderId) {
    return NextResponse.json({ error: "No payment attempt found for this registration" }, { status: 400 });
  }

  if (registration.status === "paid") {
    return NextResponse.json({ status: "CAPTURED", isPaid: true, registration });
  }

  const auth = Buffer.from(
    `merchant.${process.env.MPGS_MERCHANT_ID}:${process.env.MPGS_API_PASSWORD}`
  ).toString("base64");

  const url = `${process.env.MPGS_GATEWAY_URL}/api/rest/version/${process.env.MPGS_API_VERSION}/merchant/${process.env.MPGS_MERCHANT_ID}/order/${registration.orderId}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Basic ${auth}` },
  });

  const data = await res.json();
  console.log("[MPGS] Order status:", JSON.stringify(data, null, 2));

  const isPaid = data.status === "CAPTURED" || data.status === "AUTHORIZED";

  let updatedRegistration = registration;
  let credResult: any = null;

  if (isPaid) {
    updatedRegistration = await store.update(regId, { status: "paid", paidAt: new Date() });

    // Notify institute admin of payment
    try {
      await sendPaymentNotification(updatedRegistration);
    } catch (err) {
      console.error("[mailer] Failed to send admin payment notification:", err);
    }

    // Dispatch credentials onboarding email ONLY if student is new (not existing)
    credResult = await dispatchLmsCredentials(updatedRegistration);
  } else if (data.status === "FAILED" || data.status === "CANCELLED") {
    updatedRegistration = await store.update(regId, { status: "failed" });
  }

  return NextResponse.json({
    status: data.status,
    isPaid,
    alreadyExists: Boolean(credResult?.alreadyExists),
    registration: updatedRegistration,
  });
}
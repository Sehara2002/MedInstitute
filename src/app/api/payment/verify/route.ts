import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { sendRegistrationConfirmation, sendPaymentNotification } from "@/lib/mailer";

export async function GET(req: NextRequest) {
  const regId = req.nextUrl.searchParams.get("regId");
  if (!regId) {
    return NextResponse.json({ error: "Missing regId" }, { status: 400 });
  }

  const registration = await store.get(regId);
  if (!registration) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
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

  if (isPaid) {
    updatedRegistration = await store.update(regId, { status: "paid", paidAt: new Date() });

    try {
      await sendRegistrationConfirmation(updatedRegistration);
      await sendPaymentNotification(updatedRegistration);
    } catch (err) {
      console.error("[mailer] Failed to send emails:", err);
    }
  } else if (data.status === "FAILED" || data.status === "CANCELLED") {
    updatedRegistration = await store.update(regId, { status: "failed" });
  }

  return NextResponse.json({
    status: data.status,
    isPaid,
    registration: updatedRegistration,
  });
}
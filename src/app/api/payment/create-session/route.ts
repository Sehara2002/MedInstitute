import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { repriceRegistration } from "@/lib/coursePrice";

export async function POST(req: NextRequest) {
  const { registrationId } = await req.json();
  if (!registrationId) {
    return NextResponse.json({ error: "Missing registrationId" }, { status: 400 });
  }

  let registration = await store.get(registrationId);
  if (!registration) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }
  if (registration.status === "paid") {
    return NextResponse.json({ error: "Already paid" }, { status: 400 });
  }

  // The price is checked again right before payment: a limited-time offer may have ended
  // (or started) since the student registered. Starting payment is what keeps an offer price,
  // so a student coming back after the offer ended pays the current price, and is told so first.
  const priced = await repriceRegistration(registration);
  if (priced && "error" in priced) {
    return NextResponse.json({ error: priced.error }, { status: priced.status });
  }
  if (priced && Math.abs(priced.amount - registration.amount) >= 0.005) {
    const previousAmount = registration.amount;
    registration = await store.update(registration.id, { amount: priced.amount, course: priced.course });
    const cheaper = priced.amount < previousAmount;
    return NextResponse.json(
      {
        error: cheaper
          ? "Good news: a lower price now applies to this course. Please review the new amount and continue."
          : "The limited-time offer for this course has ended, so the current price applies. Please review the new amount before paying.",
        priceChanged: true,
        previousAmount,
        registration,
      },
      { status: 409 }
    );
  }

  const auth = Buffer.from(
    `merchant.${process.env.MPGS_MERCHANT_ID}:${process.env.MPGS_API_PASSWORD}`
  ).toString("base64");

  const orderId = `REG${registration.id.slice(0, 8)}T${Date.now().toString().slice(-10)}`;
  const url = `${process.env.MPGS_GATEWAY_URL}/api/rest/version/${process.env.MPGS_API_VERSION}/merchant/${process.env.MPGS_MERCHANT_ID}/session`;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.WEBSITE_URL ||
    "http://localhost:3001";

  const requestBody = {
    apiOperation: "INITIATE_CHECKOUT",
    interaction: {
      operation: "PURCHASE",
      merchant: {
        name: "MRCGP Fast Track",
        url: baseUrl,
      },
      displayControl: {
        billingAddress: "HIDE",
        customerEmail: "MANDATORY",
        shipping: "HIDE",
      },
      returnUrl: `${baseUrl}/register/summary/result?regId=${registration.id}`,
    },
    order: {
      id: orderId,
      amount: registration.amount.toFixed(2),
      currency: process.env.MPGS_CURRENCY || "LKR",
      description: registration.course,
      reference: `REG-${registration.id}`,
    },
    customer: {
      email: registration.email,
      firstName: registration.firstName,
      lastName: registration.lastName,
      mobilePhone: registration.phone,
    },
  };

  console.log("[MPGS] Request body:", JSON.stringify(requestBody, null, 2));

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  const data = await res.json();
  console.log("[MPGS] Status:", res.status);
  console.log("[MPGS] Response:", JSON.stringify(data, null, 2));

  if (!res.ok || data.result === "ERROR" || !data.session?.id) {
    return NextResponse.json(
      { error: data?.error?.explanation || data?.error?.cause || "Gateway rejected the request", raw: data },
      { status: 502 }
    );
  }

  await store.update(registration.id, { orderId });
  return NextResponse.json({ session: data.session, orderId, amount: registration.amount });
}
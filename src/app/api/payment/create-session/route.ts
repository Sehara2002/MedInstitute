import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST(req: NextRequest) {
  const { registrationId } = await req.json();
  if (!registrationId) {
    return NextResponse.json({ error: "Missing registrationId" }, { status: 400 });
  }

  const registration = await store.get(registrationId);
  if (!registration) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }
  if (registration.status === "paid") {
    return NextResponse.json({ error: "Already paid" }, { status: 400 });
  }

  const auth = Buffer.from(
    `merchant.${process.env.MPGS_MERCHANT_ID}:${process.env.MPGS_API_PASSWORD}`
  ).toString("base64");

  const orderId = `REG${registration.id.slice(0, 8)}T${Date.now().toString().slice(-10)}`;
  const url = `${process.env.MPGS_GATEWAY_URL}/api/rest/version/${process.env.MPGS_API_VERSION}/merchant/${process.env.MPGS_MERCHANT_ID}/session`;

  const requestBody = {
    apiOperation: "INITIATE_CHECKOUT",
    interaction: {
      operation: "PURCHASE",
      merchant: {
        name: "MRCGP Fast Track",
        url: process.env.NEXT_PUBLIC_BASE_URL,
      },
      displayControl: {
        billingAddress: "HIDE",
        customerEmail: "MANDATORY",
        shipping: "HIDE",
      },
      returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/register/summary/result?regId=${registration.id}`,
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
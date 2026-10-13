import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/mailer";
import { registerUser } from "@/lib/websiteUsers";

// Email + password sign-up. The account is created (and the password hashed)
// by the LMS backend; this site keeps no database.
export async function POST(req: Request) {
  const { name, email, password } = await req.json().catch(() => ({}));

  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const result = await registerUser({ name, email, password });
  if (result.status === "error") {
    return NextResponse.json({ error: result.message }, { status: result.httpStatus });
  }
  if (result.status !== "ok") {
    return NextResponse.json({ error: "Sign-up is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }

  const user = result.data;
  try {
    await sendWelcomeEmail({ name: user.name, email: user.email });
  } catch (mailErr) {
    console.error("[register] Welcome email failed:", mailErr);
  }

  return NextResponse.json({ user: { id: user.id, email: user.email } });
}

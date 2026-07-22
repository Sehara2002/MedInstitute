import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });

    console.log("[register] About to send welcome email to:", user.email);
    try {
      await sendWelcomeEmail({ name: user.name, email: user.email });
      console.log("[register] Welcome email sent successfully");
    } catch (mailErr) {
      console.error("[register] Welcome email FAILED:", mailErr);
    }

    return NextResponse.json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return NextResponse.json(
      { error: "Current and new password (min 6 chars) are required" },
      { status: 400 }
    );
  }

  const userId = (session.user as { id: string }).id;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user?.passwordHash) {
    return NextResponse.json(
      { error: "This account doesn't use a password (Google sign-in)" },
      { status: 400 }
    );
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });

  return NextResponse.json({ success: true });
}
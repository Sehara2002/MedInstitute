import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { changePassword } from "@/lib/websiteUsers";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json().catch(() => ({}));
  if (!currentPassword || !newPassword || String(newPassword).length < 6) {
    return NextResponse.json(
      { error: "Current and new password (min 6 chars) are required" },
      { status: 400 }
    );
  }

  const userId = (session.user as { id: string }).id;
  const result = await changePassword(userId, String(currentPassword), String(newPassword));
  if (result.status === "error") {
    return NextResponse.json({ error: result.message }, { status: result.httpStatus });
  }
  if (result.status !== "ok") {
    return NextResponse.json({ error: "Password changes are temporarily unavailable" }, { status: 503 });
  }
  return NextResponse.json({ success: true });
}

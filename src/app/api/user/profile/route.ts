import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateName } from "@/lib/websiteUsers";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { name } = await req.json().catch(() => ({}));
  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const userId = (session.user as { id: string }).id;
  const result = await updateName(userId, name.trim());
  if (result.status === "error") {
    return NextResponse.json({ error: result.message }, { status: result.httpStatus });
  }
  if (result.status !== "ok") {
    return NextResponse.json({ error: "Profile updates are temporarily unavailable" }, { status: 503 });
  }
  return NextResponse.json({ success: true });
}

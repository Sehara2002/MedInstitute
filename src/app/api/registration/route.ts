import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { courses } from "@/data/courses";
import { exams } from "@/data/exams";
import { parsePriceToNumber } from "@/lib/price";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { firstName, lastName, email, phone, courseId } = body;

  if (!firstName?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "First name and email are required" }, { status: 400 });
  }

  let course = "";
  let amount = 0;

  const found = courses.find((c) => c.id === courseId) || exams.find((e) => e.id === courseId);

  if (found) {
    course = found.title;

    if ("modePricing" in found && found.modePricing && found.modePricing.length > 0) {
      // Validate the submitted amount against the course's actual allowed mode prices —
      // don't blindly trust the client, but also don't overwrite with a single flat fee
      const allowedAmounts = found.modePricing
        .map((opt) => parsePriceToNumber(opt.fee))
        .filter((n): n is number => n !== null);

      if (typeof body.amount === "number" && allowedAmounts.includes(body.amount)) {
        amount = body.amount;
      } else {
        // Fallback if something unexpected came through — use the first mode's price
        amount = allowedAmounts[0] || 0;
      }

      // Keep the client's course label, which includes "(Online)"/"(Physical)"
      if (body.course && typeof body.course === "string") {
        course = body.course;
      }
    } else {
      amount = parsePriceToNumber(found.fee) || 0;
    }
  } else if (body.course && typeof body.amount === "number") {
    course = body.course;
    amount = body.amount;
  }

  if (amount <= 0) {
    return NextResponse.json({ error: "Could not determine a valid amount for this item" }, { status: 400 });
  }

  const session = await auth();
  const userId = session?.user ? (session.user as { id: string }).id : undefined;

  const registration = await store.create({
    firstName,
    lastName,
    email,
    phone,
    course,
    courseId: found?.id || courseId,
    amount,
    userId,
  });

  return NextResponse.json({ registration });
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const registration = await store.get(id);
  if (!registration) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ registration });
}
import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { courses } from "@/data/courses";
import { exams } from "@/data/exams";
import { parsePriceToNumber } from "@/lib/price";

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
    amount = parsePriceToNumber(found.fee) || 0;
  } else if (body.course && typeof body.amount === "number") {
    course = body.course;
    amount = body.amount;
  }

  if (amount <= 0) {
    return NextResponse.json({ error: "Could not determine a valid amount for this item" }, { status: 400 });
  }

  const registration = await store.create({ firstName, lastName, email, phone, course, amount });
  return NextResponse.json({ registration });
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const registration = await store.get(id);
  if (!registration) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ registration });
}
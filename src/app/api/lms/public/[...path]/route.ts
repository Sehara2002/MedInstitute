import { NextRequest, NextResponse } from "next/server";
import { lmsBaseUrl } from "@/lib/lms";

// Pass-through from the browser to the LMS backend's public API, so browser
// code never needs the backend address (LMS_BACKEND_URL stays server-only).
// Only /public/... is reachable: those routes need no login and return only
// what an anonymous visitor may see.

const TIMEOUT_MS = 15000;
const SEGMENT = /^[A-Za-z0-9._-]+$/;

async function forward(req: NextRequest, path: string[], method: "GET" | "POST") {
  const base = lmsBaseUrl();
  if (!base) {
    return NextResponse.json({ success: false, message: "The booking service is not configured." }, { status: 503 });
  }
  if (path.length === 0 || !path.every((p) => SEGMENT.test(p) && p !== "." && p !== "..")) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  const url = `${base}/public/${path.join("/")}${req.nextUrl.search}`;
  try {
    const res = await fetch(url, {
      method,
      headers: { Accept: "application/json", ...(method === "POST" ? { "Content-Type": "application/json" } : {}) },
      body: method === "POST" ? await req.text() : undefined,
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") || "application/json", "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error(`[lms-proxy] /public/${path.join("/")} failed:`, err instanceof Error ? err.message : err);
    return NextResponse.json(
      { success: false, message: "We could not reach the booking service. Please try again shortly." },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(req, (await params).path, "GET");
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(req, (await params).path, "POST");
}

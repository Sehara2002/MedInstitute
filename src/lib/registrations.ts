// Course registrations and payments live in the LMS backend
// (/public/course-registrations). This maps them to the shape this site's
// registration pages already use, so the pages do not depend on backend names.

import { toCourseId } from "@/data/courses";
import { lmsFetch } from "@/lib/lms";

/** A registration as returned by the LMS backend */
export interface BackendRegistration {
  reference: string;
  status: "PENDING" | "PAID" | "FAILED";
  courseId: number;
  courseName: string | null;
  courseLabel: string;
  feeKey: string;
  optionLabel: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  amount: number;
  currencyCode: string;
  orderId: string | null;
  paidAt: string | null;
  createdAt: string;
  newAccount: boolean;
  lmsLoginUrl: string;
}

/** A registration as this site's pages read it */
export interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  course: string;
  courseId: string;
  feeKey: string;
  amount: number;
  currencyCode: string;
  status: "pending" | "paid" | "failed";
  orderId: string | null;
  paidAt: string | null;
  lmsLoginUrl: string;
}

export function toRegistration(r: BackendRegistration): Registration {
  return {
    id: r.reference,
    firstName: r.firstName,
    lastName: r.lastName ?? "",
    email: r.email,
    phone: r.phone ?? "",
    course: r.courseLabel,
    courseId: toCourseId(r.courseId),
    feeKey: r.feeKey,
    amount: r.amount,
    currencyCode: r.currencyCode,
    status: r.status.toLowerCase() as Registration["status"],
    orderId: r.orderId,
    paidAt: r.paidAt,
    lmsLoginUrl: r.lmsLoginUrl,
  };
}

/** Matches the reference format the backend issues, so junk never reaches it */
export function isReference(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f-]{36}$/i.test(value);
}

/** The JSON error a route sends when the backend refused or could not be reached */
export function errorFrom(result: Awaited<ReturnType<typeof lmsFetch>>): { error: string; status: number } {
  if (result.status === "error") return { error: result.message, status: result.httpStatus };
  return { error: "Registration is temporarily unavailable. Please try again shortly.", status: 503 };
}

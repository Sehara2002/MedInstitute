/**
 * Mock exams come from the MRCGP LMS backend: admins create them in the LMS and
 * candidates book a numbered seat here. Booking, payment (Commercial Bank MPGS)
 * and the confirmation email are all handled by the backend; this site only
 * shows the exams and walks the candidate through the steps.
 */

export const LMS_API_URL = (process.env.NEXT_PUBLIC_LMS_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

/** The venue's time zone, used for every date and time shown */
const EXAM_TIMEZONE = "Asia/Colombo";

export interface MockExam {
  mockExamId: number;
  title: string;
  description: string | null;
  examDate: string;
  venue: string;
  price: number;
  currencyCode: string;
  totalSlots: number;
  bookedSlots: number;
  availableSlots: number;
  isBookable: boolean;
  /** Backend path (no origin) of the poster image, or null */
  posterUrl: string | null;
}

export type BookingStatus = "PENDING" | "PAID" | "FAILED";

export interface MockExamBooking {
  reference: string;
  status: BookingStatus;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  amount: number;
  currencyCode: string;
  slotNumber: number | null;
  paidAt: string | null;
  exam?: MockExam;
}

export interface BookingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface CheckoutSession {
  sessionId: string;
  checkoutScriptUrl: string;
  booking: MockExamBooking;
}

export class MockExamApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit & { next?: { revalidate?: number } }): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${LMS_API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    });
  } catch {
    throw new MockExamApiError("We could not reach the booking service. Please try again shortly.", 0);
  }
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new MockExamApiError(json?.message || "Something went wrong. Please try again.", res.status);
  }
  return json.data as T;
}

// ── Reads (server components) ─────────────────────────────────────────────

/** Published, upcoming mock exams, soonest first */
export function getMockExams(): Promise<MockExam[]> {
  return request<MockExam[]>("/public/mock-exams", { cache: "no-store" });
}

export function getMockExam(mockExamId: number | string): Promise<MockExam> {
  return request<MockExam>(`/public/mock-exams/${encodeURIComponent(String(mockExamId))}`, { cache: "no-store" });
}

// ── Booking steps (browser) ───────────────────────────────────────────────

export function createBooking(mockExamId: number, form: BookingForm): Promise<MockExamBooking> {
  return request<MockExamBooking>(`/public/mock-exams/${mockExamId}/bookings`, {
    method: "POST",
    body: JSON.stringify(form),
  });
}

export function getBooking(reference: string): Promise<MockExamBooking> {
  return request<MockExamBooking>(`/public/mock-exam-bookings/${encodeURIComponent(reference)}`);
}

export function startCheckout(reference: string, returnUrl: string): Promise<CheckoutSession> {
  return request<CheckoutSession>(`/public/mock-exam-bookings/${encodeURIComponent(reference)}/checkout`, {
    method: "POST",
    body: JSON.stringify({ returnUrl }),
  });
}

export function verifyBooking(reference: string): Promise<MockExamBooking> {
  return request<MockExamBooking>(`/public/mock-exam-bookings/${encodeURIComponent(reference)}/verify`, {
    method: "POST",
  });
}

// ── Display ───────────────────────────────────────────────────────────────

export function posterSrc(exam: { posterUrl: string | null }): string | null {
  if (!exam.posterUrl) return null;
  return `${LMS_API_URL.replace(/\/api$/, "")}${exam.posterUrl}`;
}

export function formatExamDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    timeZone: EXAM_TIMEZONE,
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatExamTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { timeZone: EXAM_TIMEZONE, hour: "numeric", minute: "2-digit" });
}

export function formatFee(amount: number, currencyCode: string): string {
  if (amount === 0) return "Free";
  return `${currencyCode} ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ── MPGS hosted checkout ──────────────────────────────────────────────────

declare global {
  interface Window {
    Checkout?: {
      configure: (config: { session: { id: string }; version?: string }) => void;
      showPaymentPage: () => void;
    };
  }
}

const loadedScripts = new Map<string, Promise<void>>();

function loadScript(src: string): Promise<void> {
  const existing = loadedScripts.get(src);
  if (existing) return existing;
  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loadedScripts.delete(src);
      reject(new Error("Could not load the payment page. Please check your connection and try again."));
    };
    document.head.appendChild(script);
  });
  loadedScripts.set(src, promise);
  return promise;
}

/** Start payment for a booking and hand over to the bank's payment page */
export async function payForBooking(reference: string): Promise<void> {
  const checkout = await startCheckout(reference, `${window.location.origin}/exams/booking/result`);
  await loadScript(checkout.checkoutScriptUrl);
  if (!window.Checkout) throw new Error("The payment page could not be started. Please try again.");
  window.Checkout.configure({ session: { id: checkout.sessionId }, version: "100" });
  window.Checkout.showPaymentPage();
}

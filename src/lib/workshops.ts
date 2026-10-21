/**
 * Workshops come from the MRCGP LMS backend: admins create them in the LMS and
 * candidates book a numbered seat here. Booking, payment (Commercial Bank MPGS)
 * and the confirmation email are all handled by the backend; this site only
 * shows the workshops and walks the candidate through the steps.
 *
 * Browser code reaches the backend through this site's /api/lms proxy, so the
 * backend address (LMS_BACKEND_URL) stays a server-only setting. Server-side
 * reads live in workshops.server.ts.
 */

import { showGatewayPaymentPage } from "@/lib/gatewayCheckout";

/** The venue's time zone, used for every date and time shown */
const WORKSHOP_TIMEZONE = "Asia/Colombo";

export interface Workshop {
  workshopId: number;
  title: string;
  description: string | null;
  startsAt: string;
  venue: string;
  price: number;
  currencyCode: string;
  totalSlots: number;
  bookedSlots: number;
  availableSlots: number;
  isBookable: boolean;
  /** Set by an admin in the LMS: listed first and shown in the home slideshow */
  isFeatured?: boolean;
  /** Backend path (no origin) of the poster image, or null */
  posterUrl: string | null;
}

export type BookingStatus = "PENDING" | "PAID" | "FAILED";

export interface WorkshopBooking {
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
  /** Link to join an online workshop; sent by the backend only once the seat is paid */
  joinUrl?: string | null;
  workshop?: Workshop;
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
  booking: WorkshopBooking;
}

export class WorkshopApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api/lms${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    });
  } catch {
    throw new WorkshopApiError("We could not reach the booking service. Please try again shortly.", 0);
  }
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new WorkshopApiError(json?.message || "Something went wrong. Please try again.", res.status);
  }
  return json.data as T;
}

// ── Booking steps (browser) ───────────────────────────────────────────────

export function createBooking(workshopId: number, form: BookingForm): Promise<WorkshopBooking> {
  return request<WorkshopBooking>(`/public/workshops/${workshopId}/bookings`, {
    method: "POST",
    body: JSON.stringify(form),
  });
}

export function getBooking(reference: string): Promise<WorkshopBooking> {
  return request<WorkshopBooking>(`/public/workshop-bookings/${encodeURIComponent(reference)}`);
}

export function startCheckout(reference: string, returnUrl: string): Promise<CheckoutSession> {
  return request<CheckoutSession>(`/public/workshop-bookings/${encodeURIComponent(reference)}/checkout`, {
    method: "POST",
    body: JSON.stringify({ returnUrl }),
  });
}

export function verifyBooking(reference: string): Promise<WorkshopBooking> {
  return request<WorkshopBooking>(`/public/workshop-bookings/${encodeURIComponent(reference)}/verify`, {
    method: "POST",
  });
}

// ── Display ───────────────────────────────────────────────────────────────

export function formatWorkshopDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    timeZone: WORKSHOP_TIMEZONE,
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatWorkshopTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { timeZone: WORKSHOP_TIMEZONE, hour: "numeric", minute: "2-digit" });
}

export function formatFee(amount: number, currencyCode: string): string {
  if (amount === 0) return "Free";
  return `${currencyCode} ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Start payment for a booking and hand over to the bank's payment page */
export async function payForBooking(reference: string): Promise<void> {
  const checkout = await startCheckout(reference, `${window.location.origin}/workshops/booking/result`);
  await showGatewayPaymentPage(checkout.checkoutScriptUrl, checkout.sessionId);
}

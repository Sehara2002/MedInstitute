// Server-side reads of workshops from the LMS backend (LMS_BACKEND_URL).
import { lmsFetch, lmsOrigin } from "@/lib/lms";
import { WorkshopApiError, type Workshop } from "@/lib/workshops";

async function read<T>(path: string): Promise<T> {
  const result = await lmsFetch<T>(path);
  if (result.status === "ok") return result.data;
  if (result.status === "error") throw new WorkshopApiError(result.message, result.httpStatus);
  throw new WorkshopApiError("We could not reach the booking service. Please try again shortly.", 0);
}

/** Published, upcoming workshops, soonest first */
export function getWorkshops(): Promise<Workshop[]> {
  return read<Workshop[]>("/public/workshops");
}

export function getWorkshop(workshopId: number | string): Promise<Workshop> {
  return read<Workshop>(`/public/workshops/${encodeURIComponent(String(workshopId))}`);
}

/** Absolute URL of a workshop's poster, served by the backend */
export function posterSrc(workshop: { posterUrl: string | null }): string | null {
  const origin = lmsOrigin();
  return workshop.posterUrl && origin ? `${origin}${workshop.posterUrl}` : null;
}

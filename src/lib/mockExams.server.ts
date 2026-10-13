// Server-side reads of mock exams from the LMS backend (LMS_BACKEND_URL).
import { lmsFetch, lmsOrigin } from "@/lib/lms";
import { MockExamApiError, type MockExam } from "@/lib/mockExams";

async function read<T>(path: string): Promise<T> {
  const result = await lmsFetch<T>(path);
  if (result.status === "ok") return result.data;
  if (result.status === "error") throw new MockExamApiError(result.message, result.httpStatus);
  throw new MockExamApiError("We could not reach the booking service. Please try again shortly.", 0);
}

/** Published, upcoming mock exams, soonest first */
export function getMockExams(): Promise<MockExam[]> {
  return read<MockExam[]>("/public/mock-exams");
}

export function getMockExam(mockExamId: number | string): Promise<MockExam> {
  return read<MockExam>(`/public/mock-exams/${encodeURIComponent(String(mockExamId))}`);
}

/** Absolute URL of an exam's poster, served by the backend */
export function posterSrc(exam: { posterUrl: string | null }): string | null {
  const origin = lmsOrigin();
  return exam.posterUrl && origin ? `${origin}${exam.posterUrl}` : null;
}

import { prisma } from "@/lib/prisma";
import { exams as staticExams, Exam } from "@/data/exams";

interface DbExamRow {
  exam_id: number;
  title: string;
  exam_type: string;
  status: string;
  duration_mins: number | null;
  total_marks: number | null;
  pass_marks: number | null;
  start_at: Date | string | null;
  end_at: Date | string | null;
  batch_id: number | null;
  batch_name: string | null;
  course_id: number | null;
  course_name: string | null;
  price: string | number | null;
  currency_code: string | null;
}

export async function getAllMockExams(userId?: string): Promise<Exam[]> {
  let paidIds = new Set<string>();

  if (userId) {
    try {
      const userRegistrations = await prisma.registration.findMany({
        where: { userId, status: "paid" },
        select: { courseId: true, course: true },
      });

      for (const reg of userRegistrations) {
        if (reg.courseId) paidIds.add(reg.courseId);
        if (reg.course) paidIds.add(reg.course.toLowerCase());
      }
    } catch (err) {
      console.error("[exams] Error fetching user registrations:", err);
    }
  }

  const dbExams: Exam[] = [];

  try {
    const rows = await prisma.$queryRawUnsafe<DbExamRow[]>(`
      SELECT 
        e.exam_id, 
        e.title, 
        e.exam_type, 
        e.status, 
        e.duration_mins, 
        e.total_marks, 
        e.pass_marks, 
        e.start_at, 
        e.end_at, 
        b.batch_id,
        b.batch_name, 
        c.course_id, 
        c.course_name, 
        COALESCE(e.price, c.price) AS price, 
        COALESCE(e.currency_code, 'LKR') AS currency_code 
      FROM exams e 
      LEFT JOIN batches b ON e.batch_id = b.batch_id 
      LEFT JOIN courses c ON b.course_id = c.course_id 
      WHERE e.exam_type::text = 'MOCK' OR e.title ILIKE '%mock%'
      ORDER BY e.exam_id DESC
    `);

    for (const r of rows) {
      const rawPrice = r.price ? Number(r.price) : 15000;
      const currency = r.currency_code || "LKR";
      const formattedFee = `${currency} ${rawPrice.toLocaleString()}`;
      
      let dateStr = "Scheduled Session";
      let timeStr: string | undefined = undefined;
      if (r.start_at) {
        const d = new Date(r.start_at);
        if (!isNaN(d.getTime())) {
          dateStr = d.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          timeStr = d.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });
        }
      }

      const examId = `db-exam-${r.exam_id}`;
      const isPaid = paidIds.has(examId) || (r.course_id ? paidIds.has(`course-${r.course_id}`) : false);

      dbExams.push({
        id: examId,
        title: r.title,
        description: `Official timed mock exam for ${r.course_name || "MRCGP Preparation"}${r.batch_name ? ` (${r.batch_name})` : ""}. Designed by experienced medical faculty to simulate official exam conditions with marking grid feedback.`,
        date: dateStr,
        time: timeStr,
        loc: "Online Examination Portal",
        fee: formattedFee,
        rawPrice,
        currency,
        type: "Mock Exam",
        offer: r.status === "PUBLISHED" ? "SLOTS OPEN" : "ADMIN MOCK",
        durationMins: r.duration_mins ?? undefined,
        totalMarks: r.total_marks ?? undefined,
        passMarks: r.pass_marks ?? undefined,
        courseName: r.course_name ?? undefined,
        batchName: r.batch_name ?? undefined,
        isLocked: !isPaid,
        isAdminCreated: true,
      });
    }
  } catch (err) {
    console.error("[exams] Error fetching admin exams from DB:", err);
  }

  // Also map static exams with the user's paid state
  const mappedStaticExams = staticExams.map((e) => {
    const isPaid = paidIds.has(e.id);
    return {
      ...e,
      isLocked: !isPaid,
    };
  });

  return [...dbExams, ...mappedStaticExams];
}

export async function getMockExamById(id: string): Promise<Exam | null> {
  const all = await getAllMockExams();
  return all.find((e) => e.id === id) || null;
}

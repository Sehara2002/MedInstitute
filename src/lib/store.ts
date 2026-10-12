import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prismaStore: PrismaClient | undefined;
}

const vpsDatabaseUrl =
  process.env.VPS_DATABASE_URL ||
  "postgresql://mrcgp_app:mrcgplmsCitech@54.36.82.177:5432/mrcgp_lms?schema=public";

const prisma =
  globalThis.__prismaStore ??
  new PrismaClient({
    datasources: {
      db: {
        url: vpsDatabaseUrl,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prismaStore = prisma;
}

export const store = {
  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    course: string;
    courseId?: string;
    amount: number;
    userId?: string;
  }) {
    const reg = await prisma.registration.create({ data });
    console.log("[store] created in VPS:", reg.id);
    return reg;
  },
  async get(id: string) {
    const reg = await prisma.registration.findUnique({ where: { id } });
    console.log("[store] get:", id, "| found:", !!reg);
    return reg;
  },
  async update(id: string, patch: Partial<{ status: string; orderId: string; paidAt: Date }>) {
    const reg = await prisma.registration.update({ where: { id }, data: patch });
    console.log("[store] updated:", id, "| status:", reg.status);
    return reg;
  },
  async findPaidByEmail(email: string) {
    return prisma.registration.findFirst({
      where: {
        email: email.trim().toLowerCase(),
        status: "paid",
      },
    });
  },
};
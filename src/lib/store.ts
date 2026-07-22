import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prisma = globalThis.__prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
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
    console.log("[store] created in Neon:", reg.id);
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
};
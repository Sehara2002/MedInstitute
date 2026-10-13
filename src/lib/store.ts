import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prismaStore: PrismaClient | undefined;
}

// Registrations live in the LMS database, reached through VPS_DATABASE_URL.
// Never write database credentials in the code. The client is created on first
// use so that building the site does not need the database.
function db(): PrismaClient {
  if (globalThis.__prismaStore) return globalThis.__prismaStore;

  const url = process.env.VPS_DATABASE_URL;
  if (!url) {
    throw new Error("VPS_DATABASE_URL is not set; course registrations cannot be saved");
  }

  const client = new PrismaClient({ datasources: { db: { url } } });
  globalThis.__prismaStore = client;
  return client;
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
    const reg = await db().registration.create({ data });
    console.log("[store] created:", reg.id);
    return reg;
  },
  async get(id: string) {
    const reg = await db().registration.findUnique({ where: { id } });
    console.log("[store] get:", id, "| found:", !!reg);
    return reg;
  },
  async update(
    id: string,
    patch: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      course: string;
      courseId: string | null;
      amount: number;
      status: string;
      orderId: string | null;
      paidAt: Date | null;
      userId: string | null;
    }>
  ) {
    const reg = await db().registration.update({ where: { id }, data: patch });
    console.log("[store] updated:", id, "| status:", reg.status);
    return reg;
  },
  async findPaidByEmail(email: string) {
    return db().registration.findFirst({
      where: {
        email: email.trim().toLowerCase(),
        status: "paid",
      },
    });
  },
};
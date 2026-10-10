import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_trVQ8jfO7BsI@ep-lively-wind-ayx1yqrt-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require";

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
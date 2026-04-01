import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";

type PrismaQueryLogEvent = {
  timestamp: Date;
  query: string;
  params: string;
  duration: number;
  target: string;
};

/** Payload emitted by `prisma.$on("error" | "warn" | "info", …)`. */
type PrismaClientLogEvent = {
  timestamp: Date;
  message: string;
  target: string;
};

// Single PrismaClient instance for the process —
// same principle as pg.Pool: reuse connections, don't create per-request.
const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "query"  },
    { emit: "event", level: "error"  },
    { emit: "event", level: "warn"   },
  ],
});

// Forward Prisma's internal logs to Winston
prisma.$on("query", (e: PrismaQueryLogEvent) => {
  logger.debug("Prisma query", { query: e.query, duration: `${e.duration}ms` });
});

prisma.$on("error", (e: PrismaClientLogEvent) => {
  logger.error("Prisma error", { message: e.message });
});

export async function checkDbConnection(): Promise<void> {
  await prisma.$queryRaw`SELECT 1`;
}

export { prisma };
export default prisma;
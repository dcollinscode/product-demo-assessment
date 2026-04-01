import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { requestLogger } from "./middleware/requestLogger";
import { globalErrorHandler } from "./middleware/errorHandler";
import productRoutes from "./routes/products";
import { checkDbConnection } from "./config/db";
import logger from "./utils/logger";

const app = express();
const PORT = process.env.PORT ?? 3001;

// ── Security middleware ──────────────────────────────────────────────────────
// Sets secure HTTP headers (X-Content-Type-Options, X-Frame-Options, etc.)
app.use(helmet());

// CORS — only allow our frontend origin
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

// Rate limiting — prevents brute-force and abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// ── General middleware ───────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" })); // Body size limit — prevents large payload attacks
app.use(requestLogger);

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/products", productRoutes);

// Health check endpoint — used by load balancers / orchestrators
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ── Error handling ───────────────────────────────────────────────────────────
app.use(globalErrorHandler);

// ── Startup ──────────────────────────────────────────────────────────────────
async function start() {
  await checkDbConnection();
  logger.info("Database connection verified");
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
}

start().catch((err) => {
  logger.error("Failed to start server", { error: err.message });
  process.exit(1);
});

export default app; // Export for testing
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

// Custom error class for operational errors (predictable app errors)
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Express 4 requires 4-parameter signature for error middleware
export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  if (err instanceof AppError && err.isOperational) {
    // Known, expected error — log at warn level
    logger.warn("Operational error", { message: err.message, statusCode: err.statusCode });
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Unknown/programmer error — log at error level with full stack
  logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  // Never leak internal error details to the client in production
  res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
}
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  // Log after response finishes so we have status code + duration
  res.on("finish", () => {
    logger.info("HTTP Request", {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration_ms: Date.now() - start,
      ip: req.ip,
    });
  });
  next();
}
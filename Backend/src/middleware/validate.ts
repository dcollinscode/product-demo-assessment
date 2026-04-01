import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

// Generic middleware factory — takes any Zod schema, returns Express middleware.
// The controller never sees invalid data; it's rejected here before it arrives.
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error:   "Validation failed",
        details: result.error.flatten().fieldErrors,
      });
      return;
    }
    req.body = result.data; // replace with parsed + coerced data
    next();
  };
}
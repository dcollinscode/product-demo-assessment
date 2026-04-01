import { Request, Response, NextFunction } from "express";
import * as productService from "../services/productService";

// Controllers are thin — they translate HTTP in/out and delegate to services.
// No business logic or SQL here.
export async function listProducts(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const products = await productService.getAllProducts();
    res.json({ data: products });
  } catch (err) {
    next(err); // forward to globalErrorHandler
  }
}

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ data: product });
  } catch (err) {
    next(err);
  }
}
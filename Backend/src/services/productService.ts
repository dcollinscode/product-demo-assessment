import pool from "../config/db";
import { Product, CreateProductDTO } from "../models/product";

import logger from "../utils/logger";

export async function getAllProducts(): Promise<Product[]> {
  const result = await pool.query<Product>(
    "SELECT id, name, created_at, updated_at FROM products ORDER BY created_at DESC"
  );
  logger.debug("Fetched products", { count: result.rowCount });
  return result.rows;
}

export async function createProduct(dto: CreateProductDTO): Promise<Product> {
  const { name } = dto;
  const result = await pool.query<Product>(
    "INSERT INTO products (name) VALUES ($1) RETURNING id, name, created_at, updated_at",
    [name.trim()]   // Parameterized query — prevents SQL injection
  );
  const product = result.rows[0];
  // TypeScript non-null assertion safe here: INSERT RETURNING always returns a row
  logger.info("Created product", { id: product!.id, name: product!.name });
  return product!;
}
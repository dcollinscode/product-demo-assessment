import prisma from "../config/db";
import logger from "../utils/logger";

// Note what changed from the pg version:
// - No SQL strings — Prisma generates them from method calls
// - Return types are fully inferred — no manual Product interface cast needed
// - The trim() is still here — Zod trims before this runs, but defense in depth

export async function getAllProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  logger.debug("Fetched products", { count: products.length });
  return products;
}

export async function createProduct(dto: { name: string }) {
  const product = await prisma.product.create({
    data: { name: dto.name.trim() },
  });
  logger.info("Created product", { id: product.id, name: product.name });
  return product;
}
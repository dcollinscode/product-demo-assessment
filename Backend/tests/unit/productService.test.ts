// Import Jest globals explicitly — this is the reliable fix when TypeScript
// cannot resolve jest as a global even with @types/jest configured
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

import * as productService from "../../src/services/productService";
import prisma from "../../src/config/db";

jest.mock("../../src/config/db", () => ({
  __esModule: true,
  default: {
    product: {
      findMany: jest.fn(),
      create:   jest.fn(),
    },
    $on:       jest.fn(),
    $queryRaw: jest.fn(),
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("productService", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  describe("getAllProducts", () => {
    it("returns products ordered by createdAt desc", async () => {
      const rows = [
        { id: "1", name: "Widget", createdAt: new Date(), updatedAt: new Date() },
      ];
      (mockPrisma.product.findMany as unknown as jest.MockedFunction<() => Promise<typeof rows>>).mockResolvedValueOnce(rows);

      const result = await productService.getAllProducts();

      expect(result).toEqual(rows);
      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
      });
    });

    it("propagates DB errors", async () => {
      (mockPrisma.product.findMany as unknown as jest.MockedFunction<() => Promise<never>>)
        .mockRejectedValueOnce(new Error("DB down"));
      await expect(productService.getAllProducts()).rejects.toThrow("DB down");
    });
  });

  describe("createProduct", () => {
    it("creates product with trimmed name", async () => {
      const product = {
        id: "2", name: "Gadget", createdAt: new Date(), updatedAt: new Date(),
      };
      (mockPrisma.product.create as unknown as jest.MockedFunction<() => Promise<typeof product>>).mockResolvedValueOnce(product);

      const result = await productService.createProduct({ name: "  Gadget  " });

      expect(result).toEqual(product);
      expect(mockPrisma.product.create).toHaveBeenCalledWith({
        data: { name: "Gadget" },
      });
    });

    it("propagates DB errors", async () => {
      (mockPrisma.product.create as unknown as jest.MockedFunction<() => Promise<never>>)
        .mockRejectedValueOnce(new Error("Unique constraint failed"));
      await expect(
        productService.createProduct({ name: "Widget" })
      ).rejects.toThrow("Unique constraint failed");
    });
  });
});
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app    from "../../src/app";
import prisma from "../../src/config/db";

describe("Products API", () => {
  beforeAll(async () => {
    await prisma.product.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/products", () => {
    it("returns 200 with empty array when no products exist", async () => {
      const res = await request(app).get("/api/products");

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });

  describe("POST /api/products", () => {
    it("creates a product and returns 201 with correct shape", async () => {
      const res = await request(app)
        .post("/api/products")
        .send({ name: "Test Widget" });

      expect(res.status).toBe(201);
      expect(res.body.data).toMatchObject({ name: "Test Widget" });
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.createdAt).toBeDefined();
    });

    it("trims whitespace from name before saving", async () => {
      const res = await request(app)
        .post("/api/products")
        .send({ name: "  Padded Name  " });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("Padded Name");
    });

    it("returns 400 when name is missing", async () => {
      const res = await request(app)
        .post("/api/products")
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
      expect(res.body.details.name).toBeDefined();
    });

    it("returns 400 when name is blank whitespace", async () => {
      const res = await request(app)
        .post("/api/products")
        .send({ name: "   " });

      expect(res.status).toBe(400);
    });

    it("returns 400 when name exceeds 255 characters", async () => {
      const res = await request(app)
        .post("/api/products")
        .send({ name: "a".repeat(256) });

      expect(res.status).toBe(400);
    });

    it("returns 400 when name is not a string", async () => {
      const res = await request(app)
        .post("/api/products")
        .send({ name: 123 });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/products after inserts", () => {
    it("returns all created products in descending order", async () => {
      const res = await request(app).get("/api/products");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);

      const dates = res.body.data.map((p: { createdAt: string }) =>
        new Date(p.createdAt).getTime()
      );
      expect(dates).toEqual([...dates].sort((a, b) => b - a));
    });
  });

  describe("GET /health", () => {
    it("returns 200 with status ok", async () => {
      const res = await request(app).get("/health");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: "ok" });
    });
  });
});
import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate";
import * as productController from "../controllers/productController";

const router = Router();

const createProductSchema = z.object({
  name: z
    .string({ error: "name is required" })
    .trim()
    .min(1,   "name cannot be empty")
    .max(255, "name must be 255 characters or fewer"),
});

router.get("/",  productController.listProducts);
router.post("/", validateBody(createProductSchema), productController.createProduct);

export default router;
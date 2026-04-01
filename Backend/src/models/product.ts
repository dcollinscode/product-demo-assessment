// With Prisma, the Product type is auto-generated from the schema.
// We re-export it here so the rest of the app imports from one place —
// if we ever swap ORMs again, only this file changes.
import type { Product } from "../generated/prisma/client";

export type { Product };

export interface CreateProductDTO {
  name: string;
}

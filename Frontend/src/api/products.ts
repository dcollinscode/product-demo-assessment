import { Product, CreateProductPayload, ApiResponse } from "../types/product";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

// Central fetch wrapper — consistent error handling across all calls
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await apiFetch<ApiResponse<Product[]>>("/api/products");
  return res.data;
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const res = await apiFetch<ApiResponse<Product>>("/api/products", {
    method: "POST",
    body:   JSON.stringify(payload),
  });
  return res.data;
}
import { useState, useEffect, useCallback } from "react";
import { Product } from "../types/product";
import { fetchProducts, createProduct } from "../api/products";

interface UseProductsReturn {
  products:   Product[];
  loading:    boolean;
  error:      string | null;
  addProduct: (name: string) => Promise<void>;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addProduct = async (name: string) => {
    const product = await createProduct({ name });
    // Prepend to list — no need to refetch the whole list for a single insert
    setProducts((prev) => [product, ...prev]);
  };

  return { products, loading, error, addProduct };
}
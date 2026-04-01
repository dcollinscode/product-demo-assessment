export interface Product {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
}

// Typed API response envelope — matches the backend { data: T } shape
export interface ApiResponse<T> {
  data: T;
}

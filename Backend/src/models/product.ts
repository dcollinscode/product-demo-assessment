export interface Product {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface CreateProductDTO {
    name: string;
  }
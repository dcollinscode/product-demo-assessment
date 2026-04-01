import { Product } from "../types/product";

interface Props {
  products: Product[];
  loading:  boolean;
  error:    string | null;
}

function Skeleton() {
  return (
    <ul className="skeleton-list" aria-busy="true">
      {[72, 55, 64].map((w, i) => (
        <li key={i} className="skeleton-row">
          <div className="skeleton-block skeleton-avatar" />
          <div className="skeleton-lines">
            <div className="skeleton-block skeleton-line" style={{ width: `${w}%` }} />
            <div className="skeleton-block skeleton-line" style={{ width: "80px" }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Empty() {
  return (
    <div className="empty-state">
      <h3>No products yet</h3>
      <p>Add your first product above to get started.</p>
    </div>
  );
}

function Err({ message }: { message: string }) {
  return (
    <div className="error-state" role="alert">
      <strong>Failed to load products</strong>
      <code>{message}</code>
    </div>
  );
}

function Row({ product, index }: { product: Product; index: number }) {
  return (
    <li
      className="product-row"
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <div className="product-avatar" aria-hidden>
        {product.name.charAt(0).toUpperCase()}
      </div>
      <div className="product-info">
        <p className="product-name">{product.name}</p>
        <p className="product-date">
          {new Date(product.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
          })}
        </p>
      </div>
      <span className="product-id" title={product.id}>
        #{product.id.slice(0, 6)}
      </span>
    </li>
  );
}

export function ProductList({ products, loading, error }: Props) {
  if (loading)              return <Skeleton />;
  if (error)                return <Err message={error} />;
  if (products.length === 0) return <Empty />;

  return (
    <ul className="product-list" aria-label="Products list">
      {products.map((p, i) => (
        <Row key={p.id} product={p} index={i} />
      ))}
    </ul>
  );
}
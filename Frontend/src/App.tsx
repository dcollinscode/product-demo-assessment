import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProductForm }   from "./components/ProductForm";
import { ProductList }   from "./components/ProductList";
import { useProducts }   from "./hooks/useProducts";

export default function App() {
  const { products, loading, error, addProduct } = useProducts();

  return (
    <ErrorBoundary>
      <div className="app-wrapper">
        <div className="page">
          <header className="header">
            <div className="header-eyebrow">
              <div className="logo-mark" aria-hidden />
              <span className="version-tag">v1.0.0</span>
            </div>
            <h1>Prod<em>ucts</em></h1>
            <p className="header-sub">
              Manage your product catalogue. Simple, fast, reliable.
            </p>
          </header>

          <section className="card card-section" aria-labelledby="add-heading">
            <div className="card-header">
              <h2 id="add-heading" className="card-label">New product</h2>
            </div>
            <div className="card-body">
              <ProductForm onSubmit={addProduct} />
            </div>
          </section>

          <section className="card card-section" aria-labelledby="list-heading">
            <div className="card-header">
              <h2 id="list-heading" className="card-label">Catalogue</h2>
              {!loading && !error && (
                <span className="count-badge">
                  {products.length} {products.length === 1 ? "item" : "items"}
                </span>
              )}
            </div>
            <ProductList products={products} loading={loading} error={error} />
          </section>

          <footer className="footer">
            React · Node · PostgreSQL · Built for <span>interview</span>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
}

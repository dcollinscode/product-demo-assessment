import { useState, FormEvent, useRef, useEffect } from "react";

interface Props {
  onSubmit: (name: string) => Promise<void>;
}

export function ProductForm({ onSubmit }: Props) {
  const [name,       setName]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [success,    setSuccess]    = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Product name is required");
      inputRef.current?.focus();
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(trimmed);
      setName("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      inputRef.current?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Create product">
      <div className="input-row">
        <div className="input-wrapper">
          <input
            ref={inputRef}
            id="product-name"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); if (error) setError(null); }}
            placeholder="e.g. Wireless Keyboard Pro"
            disabled={submitting}
            maxLength={255}
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={error ? "name-error" : undefined}
            className={[
              "input",
              error   ? "input--error"   : "",
              success ? "input--success" : "",
            ].filter(Boolean).join(" ")}
          />
          {name.length > 200 && (
            <span className={`char-count${name.length >= 255 ? " char-count--danger" : ""}`}>
              {255 - name.length}
            </span>
          )}
        </div>

        <button type="submit" disabled={submitting} className="btn btn-primary">
          {submitting ? "Adding…" : success ? "Added!" : "Add Product"}
        </button>
      </div>

      {error && (
        <p id="name-error" role="alert" className="field-error">{error}</p>
      )}
    </form>
  );
}
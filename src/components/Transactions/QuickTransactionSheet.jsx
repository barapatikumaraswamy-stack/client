import { useState } from "react";

export default function QuickTransactionSheet({
  product,
  type,
  onSubmit,
  onClose
}) {
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!qty || Number(qty) === 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    if (type === "sale" && Number(qty) < 0) {
      setError("Sale quantity must be positive");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(Number(qty), note);
    } catch (err) {
      setError(err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const typeLabel = {
    purchase: "Purchase",
    sale: "Sale",
    adjustment: "Adjustment"
  }[type];

  const typeColor = {
    purchase: "pill-green",
    sale: "pill-red",
    adjustment: "pill-yellow"
  }[type];

  return (
    <div className="sheet">
      <header className="sheet-header">
        <div>
          <h3>{typeLabel}</h3>
          <p className="page-subtitle">{product.name}</p>
        </div>
        <button className="icon-btn" onClick={onClose}>✕</button>
      </header>

      <form onSubmit={handleSubmit} className="sheet-body">
        {error && <div className="error-box">{error}</div>}

        <div className="form-row">
          <label>Quantity {type === "sale" ? "(positive number)" : ""}</label>
          <input
            type="number"
            className="form-input"
            placeholder="0"
            value={qty}
            onChange={e => setQty(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="form-row">
          <label>Note (optional)</label>
          <textarea
            className="form-input"
            placeholder="Reason for adjustment..."
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={3}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className={`primary-btn ${typeColor}`}
          style={{ width: "100%" }}
          disabled={loading}
        >
          {loading ? "Processing..." : typeLabel}
        </button>
      </form>
    </div>
  );
}

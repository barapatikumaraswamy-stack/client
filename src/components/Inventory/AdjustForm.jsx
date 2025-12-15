// src/components/Inventory/AdjustForm.jsx
import { useState, useEffect } from "react";
import api from "../../api/client";

export default function AdjustForm({ onAdjusted }) {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantityDelta, setQuantityDelta] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!productId) {
      setError("Please select a product");
      return;
    }

    if (!quantityDelta || Number(quantityDelta) === 0) {
      setError("Quantity delta cannot be zero");
      return;
    }

    setLoading(true);
    try {
      const body = {
        productId,
        location: "MAIN",
        quantityDelta: Number(quantityDelta),
        note,
        updateProduct: true
      };
      const res = await api.post("/inventory/adjust", body);
      onAdjusted(res.data);
      setProductId("");
      setQuantityDelta("");
      setNote("");
    } catch (err) {
      setError(err.response?.data?.message || "Adjust failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <header className="card-header">
        <h2>Adjust Stock</h2>
        <p className="page-subtitle">Quick inventory adjustments</p>
      </header>

      <form onSubmit={handleSubmit} className="card-body">
        {error && <div className="error-box">{error}</div>}

        <div className="form-row">
          <label htmlFor="product">Product</label>
          <select
            id="product"
            className="form-input"
            required
            value={productId}
            onChange={e => setProductId(e.target.value)}
            disabled={loading}
          >
            <option value="">Select product</option>
            {products.map(p => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.sku})
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="quantity">Quantity delta</label>
          <input
            id="quantity"
            type="number"
            className="form-input"
            placeholder="Enter positive or negative number"
            value={quantityDelta}
            onChange={e => setQuantityDelta(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="note">Note (optional)</label>
          <textarea
            id="note"
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
          className="primary-btn"
          disabled={loading}
        >
          {loading ? "Applying..." : "Apply Adjustment"}
        </button>
      </form>
    </section>
  );
}

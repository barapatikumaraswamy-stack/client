import { useState, useEffect } from "react";
import api from "../../api/client";

export default function AdjustForm({ onAdjusted }) {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantityDelta, setQuantityDelta] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const body = {
        productId,
        location: "MAIN",
        quantityDelta: Number(quantityDelta),
        note
      };
      const res = await api.post("/inventory/adjust", body);
      onAdjusted(res.data);
      setQuantityDelta("");
      setNote("");
    } catch (err) {
      setError(err.response?.data?.message || "Adjust failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Adjust stock</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Product</label>
        <select
          required
          value={productId}
          onChange={e => setProductId(e.target.value)}
        >
          <option value="">Select</option>
          {products.map(p => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Quantity delta</label>
        <input
          type="number"
          value={quantityDelta}
          onChange={e => setQuantityDelta(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Note</label>
        <input value={note} onChange={e => setNote(e.target.value)} />
      </div>
      <button type="submit">Apply</button>
    </form>
  );
}

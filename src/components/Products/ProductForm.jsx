import { useState, useEffect } from "react";
import api from "../../api/client";

export default function ProductForm({ onCreated }) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [openingQuantity, setOpeningQuantity] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/suppliers").then(res => setSuppliers(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const body = {
        name,
        sku,
        salePrice: Number(salePrice),
        purchasePrice: Number(purchasePrice),
        soldBy: supplierId || null,
        openingQuantity: openingQuantity ? Number(openingQuantity) : 0,
      };
      const res = await api.post("/products", body);
      onCreated(res.data);
      setName("");
      setSku("");
      setSalePrice("");
      setPurchasePrice("");
      setOpeningQuantity("");
      setSupplierId("");
    } catch (err) {
      setError(err.response?.data?.message || "Create failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create product</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label>SKU</label>
        <input value={sku} onChange={e => setSku(e.target.value)} required />
      </div>
      <div>
        <label>Sale price</label>
        <input type="number"
               value={salePrice}
               onChange={e => setSalePrice(e.target.value)}
               required />
      </div>
      <div>
        <label>Purchase price</label>
        <input type="number"
               value={purchasePrice}
               onChange={e => setPurchasePrice(e.target.value)}
               required />
      </div>
      <div>
        <label>Opening quantity</label>
        <input type="number"
               value={openingQuantity}
               onChange={e => setOpeningQuantity(e.target.value)} />
      </div>
      <div>
        <label>Supplier</label>
        <select value={supplierId} onChange={e => setSupplierId(e.target.value)}>
          <option value="">None</option>
          {suppliers.map(s => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
      </div>
      <button type="submit">Save</button>
    </form>
  );
}

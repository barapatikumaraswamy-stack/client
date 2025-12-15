// src/components/Products/ProductEditSheet.jsx
import { useState } from "react";
import api from "../../api/client";

export default function ProductEditSheet({ product, onClose, onUpdated }) {
  const [values, setValues] = useState({
    name: product.name || "",
    sku: product.sku || "",
    barcode: product.barcode || "",
    category: product.category || "",
    purchasePrice: product.purchasePrice ?? "",
    salePrice: product.salePrice ?? "",
    taxRate: product.taxRate ?? 0,
    isActive: product.isActive ? "true" : "false"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!values.name.trim()) {
      setError("Name is required");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/products/${product._id}`, {
        name: values.name,
        sku: values.sku,
        barcode: values.barcode || undefined,
        category: values.category || undefined,
        purchasePrice: Number(values.purchasePrice),
        salePrice: Number(values.salePrice),
        taxRate: values.taxRate ? Number(values.taxRate) : 0,
        isActive: values.isActive === "true"
      });
      onUpdated?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sheet">
      <header className="sheet-header">
        <div>
          <h3>Edit product</h3>
          <p className="page-subtitle">{product.sku}</p>
        </div>
        <button className="icon-btn" onClick={onClose}>✕</button>
      </header>

      <form className="sheet-body" onSubmit={handleSubmit}>
        {error && <div className="error-box">{error}</div>}

        <div className="form-row">
          <label>Name</label>
          <input
            className="form-input"
            value={values.name}
            onChange={e => handleChange("name", e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label>SKU</label>
          <input
            className="form-input"
            value={values.sku}
            onChange={e => handleChange("sku", e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label>Barcode</label>
          <input
            className="form-input"
            value={values.barcode}
            onChange={e => handleChange("barcode", e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label>Category</label>
          <input
            className="form-input"
            value={values.category}
            onChange={e => handleChange("category", e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label>Purchase price</label>
          <input
            type="number"
            className="form-input"
            value={values.purchasePrice}
            onChange={e => handleChange("purchasePrice", e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label>Sale price</label>
          <input
            type="number"
            className="form-input"
            value={values.salePrice}
            onChange={e => handleChange("salePrice", e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label>Tax rate (%)</label>
          <input
            type="number"
            className="form-input"
            value={values.taxRate}
            onChange={e => handleChange("taxRate", e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label>Status</label>
          <select
            className="form-input"
            value={values.isActive}
            onChange={e => handleChange("isActive", e.target.value)}
            disabled={loading}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          className="primary-btn"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}

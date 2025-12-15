import { useEffect, useState } from "react";
import api from "../../api/client";

export default function InventoryList() {
  const [items, setItems] = useState([]);
  const [showLow, setShowLow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    quantity: "",
    minLevel: "",
    maxLevel: ""
  });

  const load = async () => {
    setLoading(true);
    const res = await api.get("/inventory", {
      params: showLow ? { lowStock: "true" } : {}
    });
    setItems(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [showLow]);

  const startEdit = (inv) => {
    setEditingId(inv._id);
    setEditValues({
      quantity: inv.quantity ?? 0,
      minLevel: inv.minLevel ?? 0,
      maxLevel: inv.maxLevel ?? 0
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ quantity: "", minLevel: "", maxLevel: "" });
  };

  const handleFieldChange = (name, value) => {
    setEditValues(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (inv) => {
    const newQty = Number(editValues.quantity);
    const newMin =
      editValues.minLevel === "" ? undefined : Number(editValues.minLevel);
    const newMax =
      editValues.maxLevel === "" ? undefined : Number(editValues.maxLevel);

    await api.post("/inventory/adjust", {
      productId: inv.product._id,
      location: inv.location,
      quantityDelta: newQty - inv.quantity,
      minLevel: newMin,
      maxLevel: newMax,
      note: "Manual inventory adjustment",
      updateProduct: true
    });

    await load();
    cancelEdit();
  };

  return (
    <section className="card">
      <header className="card-header">
        <div>
          <h2>Inventory</h2>
          <p className="page-subtitle">Stock levels by location</p>
        </div>

        <div className="filters-row">
          <label className="filter-pill">
            <input
              type="checkbox"
              checked={showLow}
              onChange={e => setShowLow(e.target.checked)}
              style={{ marginRight: 6 }}
            />
            Low stock only
          </label>
          <button className="primary-btn" onClick={load} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      <div className="card-body">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Location</th>
              <th>Qty</th>
              <th>Min level</th>
              <th>Max level</th>
              <th>Status</th>
              <th>Adjust</th>
            </tr>
          </thead>
          <tbody>
            {items.map(inv => {
              const low =
                typeof inv.minLevel === "number" &&
                inv.minLevel > 0 &&
                inv.quantity <= inv.minLevel;

              const isEditing = editingId === inv._id;

              return (
                <tr key={inv._id}>
                  <td>{inv.product?.name || "—"}</td>
                  <td>{inv.product?.sku || "—"}</td>
                  <td>{inv.location}</td>

                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        className="form-input"
                        value={editValues.quantity}
                        onChange={e =>
                          handleFieldChange("quantity", e.target.value)
                        }
                      />
                    ) : (
                      inv.quantity
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        className="form-input"
                        value={editValues.minLevel}
                        onChange={e =>
                          handleFieldChange("minLevel", e.target.value)
                        }
                      />
                    ) : (
                      inv.minLevel ?? "—"
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        className="form-input"
                        value={editValues.maxLevel}
                        onChange={e =>
                          handleFieldChange("maxLevel", e.target.value)
                        }
                      />
                    ) : (
                      inv.maxLevel ?? "—"
                    )}
                  </td>

                  <td>
                    {low ? (
                      <span className="pill pill-red">Low stock</span>
                    ) : (
                      <span className="pill pill-blue">OK</span>
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <div className="tx-actions">
                        <button
                          className="pill-btn pill-green"
                          onClick={() => saveEdit(inv)}
                        >
                          Save
                        </button>
                        <button
                          className="pill-btn pill-red"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className="pill-btn"
                        onClick={() => startEdit(inv)}
                      >
                        Adjust
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}

            {items.length === 0 && !loading && (
              <tr>
                <td colSpan={8}>No inventory records.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

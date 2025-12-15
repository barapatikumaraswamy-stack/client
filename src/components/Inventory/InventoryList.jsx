import { useEffect, useState } from "react";
import api from "../../api/client";

export default function InventoryList() {
  const [items, setItems] = useState([]);
  const [showLow, setShowLow] = useState(false);

  const load = async () => {
    const res = await api.get("/inventory", {
      params: showLow ? { lowStock: "true" } : {}
    });
    setItems(res.data);
  };

  useEffect(() => {
    load();
  }, [showLow]);

  return (
    <div>
      <h2>Inventory</h2>
      <label>
        <input
          type="checkbox"
          checked={showLow}
          onChange={e => setShowLow(e.target.checked)}
        />
        Low stock only
      </label>
      <button onClick={load}>Refresh</button>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Location</th>
            <th>Qty</th>
            <th>Min</th>
            <th>Max</th>
          </tr>
        </thead>
        <tbody>
          {items.map(inv => (
            <tr key={inv._id}>
              <td>{inv.product?.name}</td>
              <td>{inv.location}</td>
              <td>{inv.quantity}</td>
              <td>{inv.minLevel}</td>
              <td>{inv.maxLevel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

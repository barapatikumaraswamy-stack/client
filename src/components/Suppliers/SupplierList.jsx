// src/components/Suppliers/SupplierList.jsx
import { useEffect, useState } from "react";
import api from "../../api/client";

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await api.get("/suppliers");
    setSuppliers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = suppliers.filter(s => {
    if (!q.trim()) return true;
    const term = q.trim().toLowerCase();
    return (
      s.name.toLowerCase().includes(term) ||
      (s.email || "").toLowerCase().includes(term) ||
      (s.phone || "").toLowerCase().includes(term)
    );
  });

  return (
    <section className="card">
      <header className="card-header">
        <div>
          <h2>Suppliers</h2>
          <p className="page-subtitle">Vendors and contacts</p>
        </div>
        <div className="filters-row">
          <input
            className="filter-input"
            placeholder="Search suppliers..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>
      </header>

      <div className="card-body">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Products</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.email || "—"}</td>
                <td>{s.phone || "—"}</td>
                <td>{s.address || "—"}</td>
                <td>{s.productsSupplied?.length || 0}</td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr>
                <td colSpan={5}>No suppliers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

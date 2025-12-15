import { useEffect, useState } from "react";
import api from "../../api/client";

export default function ProductTransactions({ product, onClose }) {
  const [tx, setTx] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await api.get("/transactions");
    const all = res.data;
    setTx(all.filter(t => t.product?._id === product._id));
    setLoading(false);
  };

  useEffect(() => {
    if (product) load();
  }, [product]);

  if (!product) return null;

  return (
    <div className="sheet">
      <header className="sheet-header">
        <div>
          <h3>Transactions</h3>
          <p className="page-subtitle">{product.name}</p>
        </div>
        <button className="icon-btn" onClick={onClose}>✕</button>
      </header>

      <div className="sheet-body">
        {loading ? (
          <p>Loading…</p>
        ) : tx.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Location</th>
                <th>Qty</th>
                <th>User</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {tx.map(t => (
                <tr key={t._id}>
                  <td>{new Date(t.createdAt).toLocaleString()}</td>
                  <td>{t.type}</td>
                  <td>{t.location}</td>
                  <td>{t.quantity}</td>
                  <td>{t.user ? t.user.name : "—"}</td>
                  <td>{t.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

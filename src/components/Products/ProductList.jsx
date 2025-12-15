// src/components/Products/ProductList.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../api/client";
import ProductTransactions from "../Transactions/ProductTransactions";
import QuickTransactionSheet from "../Transactions/QuickTransactionSheet";
import ProductEditSheet from "./ProductEditSheet";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const createTx = async (product, type, qtyDelta, note = "") => {
    setBusyId(product._id);
    try {
      const body = {
        type,
        productId: product._id,
        location: "MAIN",
        quantity: qtyDelta,
        note
      };
      await api.post("/transactions", body);
      await load();
      setSelectedSheet(null);
      setSelectedProduct(null);
    } catch (err) {
      alert(err.response?.data?.message || "Transaction failed");
    } finally {
      setBusyId(null);
    }
  };

  const load = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return products;
    const term = q.trim().toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.sku.toLowerCase().includes(term) ||
      (p.soldBy?.name || "").toLowerCase().includes(term)
    );
  }, [products, q]);

  const closeSheet = () => {
    setSelectedSheet(null);
    setSelectedProduct(null);
  };

  const openSheet = (product, sheet) => {
    setSelectedProduct(product);
    setSelectedSheet(sheet);
  };

  const renderSheet = () => {
    if (!selectedProduct) return null;

    if (selectedSheet === "transactions") {
      return (
        <ProductTransactions
          product={selectedProduct}
          onClose={closeSheet}
        />
      );
    }

    if (selectedSheet === "edit") {
      return (
        <ProductEditSheet
          product={selectedProduct}
          onClose={closeSheet}
          onUpdated={load}
        />
      );
    }

    const txTypes = {
      purchase: "purchase",
      sale: "sale",
      adjustment: "adjustment"
    };

    if (txTypes[selectedSheet]) {
      return (
        <QuickTransactionSheet
          product={selectedProduct}
          type={selectedSheet}
          onSubmit={async (qty, note) => {
            await createTx(selectedProduct, selectedSheet, qty, note);
          }}
          onClose={closeSheet}
        />
      );
    }

    return null;
  };

  return (
    <div className="page-body">
      <section className="card">
        <header className="card-header">
          <div>
            <h2>Products</h2>
            <p className="page-subtitle">Catalog, pricing and suppliers</p>
          </div>
          <div className="filters-row">
            <input
              className="filter-input"
              placeholder="Search products..."
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
                <th>SKU</th>
                <th>Sale price</th>
                <th>Purchase price</th>
                <th>Supplier</th>
                <th>Quick Tx</th>
                <th>History</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>${Number(p.salePrice).toFixed(2)}</td>
                  <td>${Number(p.purchasePrice).toFixed(2)}</td>
                  <td>{p.soldBy ? p.soldBy.name : "—"}</td>
                  <td>
                    <div className="tx-actions">
                      <button
                        className="pill-btn pill-green"
                        disabled={busyId === p._id}
                        onClick={() => openSheet(p, "purchase")}
                      >
                        + Buy
                      </button>
                      <button
                        className="pill-btn pill-red"
                        disabled={busyId === p._id}
                        onClick={() => openSheet(p, "sale")}
                      >
                        - Sell
                      </button>
                      <button
                        className="pill-btn"
                        disabled={busyId === p._id}
                        onClick={() => openSheet(p, "edit")} // admin edit
                      >
                        Adjust
                      </button>
                    </div>
                  </td>
                  <td>
                    <button
                      className="primary-btn"
                      onClick={() => openSheet(p, "transactions")}
                    >
                      View Tx
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7}>No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {renderSheet()}
    </div>
  );
}

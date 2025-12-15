// src/components/Products/ProductPage.jsx
import { useState } from "react";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import PageShell from "../../layout/PageShell";

export default function ProductPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <PageShell
      title="Products"
      subtitle="Manage catalog and pricing"
      actions={
        <button
          className="primary-btn"
          onClick={() => setShowForm(prev => !prev)}
        >
          {showForm ? "Cancel" : "+ Add product"}
        </button>
      }
    >
      <section className="card">
        <header className="card-header">
          <div className="filters-row">
            <div className="filter-pill">All warehouses</div>
          </div>
        </header>

        <div className="card-body">
          {showForm && (
            <div className="form-wrapper">
              <ProductForm onCreated={() => setShowForm(false)} />
            </div>
          )}

          <ProductList />
        </div>
      </section>
    </PageShell>
  );
}

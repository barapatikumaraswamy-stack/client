// src/components/Products/ProductPage.jsx
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import PageShell from "../../layout/PageShell";

export default function ProductPage() {
  return (
    <PageShell
      title="Products"
      subtitle="Manage catalog and pricing"
      actions={<button className="primary-btn">+ New Product</button>}
    >
      <section className="card">
        <header className="card-header">
          <div className="filters-row">
            <div className="filter-pill">All warehouses</div>
            <input className="filter-input" placeholder="Search products..." />
          </div>
        </header>
        <div className="card-body">
          <ProductList />
        </div>
      </section>

      <section className="card">
        <header className="card-header">
          <h2>Create / Edit</h2>
        </header>
        <div className="card-body">
          <ProductForm onCreated={() => {}} />
        </div>
      </section>
    </PageShell>
  );
}

// src/components/Suppliers/SupplierPage.jsx
import { useState } from "react";
import PageShell from "../../layout/PageShell";
import SupplierForm from "./SupplierForm";
import SupplierList from "./SupplierList";

export default function SupplierPage() {
  const [showForm, setShowForm] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(0);

  const handleCreated = () => {
    setShowForm(false);
    setReloadFlag(f => f + 1);
  };

  return (
    <PageShell
      title="Suppliers"
      subtitle="Manage vendors and contacts"
      actions={
        <button
          className="primary-btn"
          onClick={() => setShowForm(prev => !prev)}
        >
          {showForm ? "Cancel" : "+ Add supplier"}
        </button>
      }
    >
      <section className="card">
        <header className="card-header">
          <div className="filters-row">
            <div className="filter-pill">All suppliers</div>
          </div>
        </header>

        <div className="card-body">
          {showForm && (
            <div className="form-wrapper">
              <SupplierForm onCreated={handleCreated} />
            </div>
          )}

          {/* pass reloadFlag if you want SupplierList to refetch on create */}
          <SupplierList key={reloadFlag} />
        </div>
      </section>
    </PageShell>
  );
}

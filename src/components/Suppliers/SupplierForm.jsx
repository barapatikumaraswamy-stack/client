// src/components/Suppliers/SupplierForm.jsx
import { useState } from "react";
import api from "../../api/client";
import FormCard from "../common/FormCard";

export default function SupplierForm({ onCreated }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const handleFieldChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const fields = [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Phone", type: "text" },
    { name: "address", label: "Address", type: "text" }
  ];

  const handleSubmit = async (formValues) => {
    setError("");

    if (!formValues.name.trim()) {
      setError("Supplier name is required");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/suppliers", {
        name: formValues.name,
        email: formValues.email || undefined,
        phone: formValues.phone || undefined,
        address: formValues.address || undefined
      });

      setValues({
        name: "",
        email: "",
        phone: "",
        address: ""
      });

      onCreated?.(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <div className="error-box">{error}</div>}
      <FormCard
        title="Create supplier"
        fields={fields}
        submitLabel={loading ? "Saving..." : "Save"}
        onSubmit={handleSubmit}
        onFieldChange={handleFieldChange}
        values={values}
        disabled={loading}
      />
    </>
  );
}

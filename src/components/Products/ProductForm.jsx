import { useEffect, useState } from "react";
import api from "../../api/client";
import FormCard from "../common/FormCard";

export default function ProductForm({ onCreated }) {
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    sku: "",
    salePrice: "",
    purchasePrice: "",
    openingQuantity: "",
    supplierId: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get("/suppliers")
      .then(res => setSuppliers(res.data))
      .catch(() => {});
  }, []);

  const generateSku = (name) => {
    return name
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "_");
  };

  const handleFieldChange = (name, value) => {
    setFormValues(prev => {
      const updated = { ...prev, [name]: value };
      if (name === "name") {
        updated.sku = generateSku(value);
      }
      return updated;
    });
  };

  const fields = [
    {
      name: "name",
      label: "Name",
      type: "text"
    },
    {
      name: "sku",
      label: "SKU",
      type: "text",
      readOnly: true
    },
    {
      name: "salePrice",
      label: "Sale price",
      type: "number"
    },
    {
      name: "purchasePrice",
      label: "Purchase price",
      type: "number"
    },
    {
      name: "openingQuantity",
      label: "Opening quantity",
      type: "number"
    },
    {
      name: "supplierId",
      label: "Supplier",
      type: "select",
      placeholder: "None",
      options: suppliers.map(s => ({ value: s._id, label: s.name }))
    }
  ];

  const handleSubmit = async (values) => {
    setError("");

    if (!values.name.trim()) {
      setError("Product name is required");
      return;
    }
    if (!values.salePrice || Number(values.salePrice) <= 0) {
      setError("Sale price must be greater than 0");
      return;
    }
    if (!values.purchasePrice || Number(values.purchasePrice) <= 0) {
      setError("Purchase price must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      const body = {
        name: values.name,
        sku: values.sku,
        salePrice: Number(values.salePrice),
        purchasePrice: Number(values.purchasePrice),
        soldBy: values.supplierId || null,
        openingQuantity: values.openingQuantity
          ? Number(values.openingQuantity)
          : 0
      };
      const res = await api.post("/products", body);

      setFormValues({
        name: "",
        sku: "",
        salePrice: "",
        purchasePrice: "",
        openingQuantity: "",
        supplierId: ""
      });

      onCreated(res.data);
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
        title="Create product"
        fields={fields}
        submitLabel={loading ? "Creating..." : "Save"}
        onSubmit={handleSubmit}
        onFieldChange={handleFieldChange}
        values={formValues}
        disabled={loading}
      />
    </>
  );
}

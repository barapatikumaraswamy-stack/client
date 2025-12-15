import { useEffect, useState } from "react";
import api from "../../api/client";
import ProductForm from "./ProductForm";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");

  const load = async () => {
    const res = await api.get("/products", { params: { q } });
    setProducts(res.data);
  };

  useEffect(() => {
    load();
  }, []); // initial

  return (
    <div>
      <h2>Products</h2>
      <div>
        <input
          placeholder="Search"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <button onClick={load}>Search</button>
      </div>

      <ProductForm onCreated={p => setProducts(prev => [p, ...prev])} />

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Sale</th>
            <th>Purchase</th>
            <th>Supplier</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>{p.salePrice}</td>
              <td>{p.purchasePrice}</td>
              <td>{p.soldBy ? p.soldBy.name : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

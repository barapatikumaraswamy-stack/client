import { useState, useEffect } from "react";
import LoginForm from "./components/Auth/LoginForm";
import ProductPage from "./components/Products/ProductPage";
import InventoryList from "./components/Inventory/InventoryList";
import AdjustForm from "./components/Inventory/AdjustForm";
import SupplierPage from "./components/Suppliers/SupplierPage";
import AnalyticsPage from "./components/Analytics/AnalyticsPage";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("products");

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally, verify token is still valid by calling API
      // For now, just restore user state if token exists
      setUser(true);
    }
  }, []);

  // If no token, show login
  if (!user && !localStorage.getItem("token")) {
    return <LoginForm onLogin={setUser} />;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setPage("products"); // Reset page
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Store Inventory</h1>

        <nav className="app-nav">
          <button
            className={page === "analytics" ? "nav-btn active" : "nav-btn"}
            onClick={() => setPage("analytics")}
          >
            Analytics
          </button>
          <button
            className={page === "products" ? "nav-btn active" : "nav-btn"}
            onClick={() => setPage("products")}
          >
            Products
          </button>
          <button
            className={page === "inventory" ? "nav-btn active" : "nav-btn"}
            onClick={() => setPage("inventory")}
          >
            Inventory
          </button>
          <button
            className={page === "adjust" ? "nav-btn active" : "nav-btn"}
            onClick={() => setPage("adjust")}
          >
            Adjust Stock
          </button>
          <button
            className={page === "suppliers" ? "nav-btn active" : "nav-btn"}
            onClick={() => setPage("suppliers")}
          >
            Suppliers
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="app-main">
        {page === "analytics" && <AnalyticsPage />}
        {page === "products" && <ProductPage />}
        {page === "inventory" && <InventoryList />}
        {page === "adjust" && <AdjustForm onAdjusted={() => {}} />}
        {page === "suppliers" && <SupplierPage />}
      </main>
    </div>
  );
}

export default App;

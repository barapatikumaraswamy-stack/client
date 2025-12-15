import { useState } from "react";
import LoginForm from "./components/Auth/LoginForm";
import ProductPage from "./components/Products/ProductPage";
import InventoryList from "./components/Inventory/InventoryList";
import AdjustForm from "./components/Inventory/AdjustForm";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("products"); // "products" | "inventory" | "adjust"

  if (!user && !localStorage.getItem("token")) {
    return <LoginForm onLogin={setUser} />;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <div>
      <header className="app-header">
        <h1>Store Inventory</h1>

        <nav className="app-nav">
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
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="app-main">
        {page === "products" && <ProductPage />}

        {page === "inventory" && (
          <div>
            <InventoryList />
          </div>
        )}

        {page === "adjust" && (
          <div>
            <AdjustForm onAdjusted={() => {}} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

import { useState } from "react";
import LoginForm from "./components/Auth/LoginForm";
import ProductList from "./components/Products/ProductList";
import InventoryList from "./components/Inventory/InventoryList";
import AdjustForm from "./components/Inventory/AdjustForm";

function App() {
  const [user, setUser] = useState(null);

  if (!user && !localStorage.getItem("token")) {
    return <LoginForm onLogin={setUser} />;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <div>
      <header>
        <h1>Store Inventory</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <main style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <div>
          <ProductList />
        </div>
        <div>
          <InventoryList />
          <AdjustForm onAdjusted={() => {}} />
        </div>
      </main>
    </div>
  );
}

export default App;

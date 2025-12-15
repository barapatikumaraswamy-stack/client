// src/components/Auth/LoginForm.jsx
import { useState } from "react";
import api from "../../api/client";
import "./LoginForm.css";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Store Inventory</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-box">{error}</div>}

          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="login-footer">
          Demo credentials available in console
        </p>
      </div>
    </div>
  );
}

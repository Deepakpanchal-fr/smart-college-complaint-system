import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    { login, loading } = useAuth(),
    nav = useNavigate(),
    loc = useLocation();
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      nav(loc.state?.from || "/go");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };
  return (
    <AuthCard
      title="Welcome back"
      sub="Sign in to your college complaint portal"
    >
      <form onSubmit={submit}>
        {error && <div className="alert">{error}</div>}
        <label>
          Email
          <input
          placeholder=" Enter Your Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            placeholder=" Enter Your Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="btn full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className="center">
        New here? <Link to="/register">Create student account</Link>
      </p>
    </AuthCard>
  );
}
function AuthCard({ title, sub, children }) {
  return (
    <section className="auth">
      <div className="authBox">
        <div className="logoCircle">🎓</div>
        <h1>{title}</h1>
        <p>{sub}</p>
        {children}
      </div>
    </section>
  );
}

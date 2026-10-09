import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Register() {
  const [f, setF] = useState({ name: "", email: "", password: "" }),
    [error, setError] = useState(""),
    [ok, setOk] = useState(""),
    { register } = useAuth(),
    nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");
    try {
      await register(f);
      setOk("Registration successful. You can now login.");
      setTimeout(() => nav("/login"), 700);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };
  return (
    <section className="auth">
      <div className="authBox">
        <div className="logoCircle">🎓</div>
        <h1>Create account</h1>
        <p>Student registration for SmartComplaints</p>
        {error && <div className="alert">{error}</div>}
        {ok && <div className="success">{ok}</div>}
        <form onSubmit={submit}>
          <label>
            Full Name
            <input
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={f.email}
              onChange={(e) => setF({ ...f, email: e.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              minLength="6"
              value={f.password}
              onChange={(e) => setF({ ...f, password: e.target.value })}
              required
            />
          </label>
          <button className="btn full">Create Account</button>
        </form>
        <p className="center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}

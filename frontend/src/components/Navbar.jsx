import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const { user, logout } = useAuth(),
    nav = useNavigate();
  return (
    <header className="nav">
      <Link className="brand" to="/">
        🎓 SmartComplaints
      </Link>
      <nav>
        {user ? (
          <>
            <Link to="/notifications">🔔</Link>
            <Link to="/go">Dashboard</Link>
            <button
              className="linkBtn"
              onClick={() => {
                logout();
                nav("/");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link className="btn small" to="/register">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

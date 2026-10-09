import React, { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("scc_user"));
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const save = (u, t) => {
    localStorage.setItem("scc_user", JSON.stringify(u));
    localStorage.setItem("scc_token", t);
    setUser(u);
  };
  const login = async (email, password) => {
    setLoading(true);
    try {
      const r = await api.post("/auth/login", { email, password });
      save(r.data.user, r.data.token);
      return r.data;
    } finally {
      setLoading(false);
    }
  };
  const register = async (data) => {
    const r = await api.post("/auth/register", data);
    return r.data;
  };
  const logout = async() => {
    localStorage.removeItem("scc_user");
    localStorage.removeItem("scc_token");
    try {
   const data =  await logout({email,password})
   setuser(null)
  
 } catch (error) {
  console.log(error);
  
 }
  };
  useEffect(() => {
    const t = localStorage.getItem("scc_token");
    if (t)
      api
        .get("/auth/me")
        .then((r) => {
          localStorage.setItem("scc_user", JSON.stringify(r.data.user));
          setUser(r.data.user);
        })
        .catch(logout);
  }, []);
  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);

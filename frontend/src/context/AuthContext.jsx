import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchMe, loginUser, registerUser } from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("chorely_token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then(setUser)
      .catch(() => localStorage.removeItem("chorely_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { token, user: u } = await loginUser({ email, password });
    localStorage.setItem("chorely_token", token);
    setUser(u);
  };

  const register = async (name, email, password) => {
    const { token, user: u } = await registerUser({ name, email, password });
    localStorage.setItem("chorely_token", token);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("chorely_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
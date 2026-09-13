import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <p className="font-display text-gold text-lg">Loading...</p>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
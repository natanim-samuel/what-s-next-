import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import MyChores from "./pages/chores/MyChores.jsx";
import AllChores from "./pages/chores/AllChores.jsx";
import Distribution from "./pages/distribution/Distribution.jsx";
import Members from "./pages/members/Members.jsx";
import Statistics from "./pages/statistics/Statistics.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chores/mine" element={<MyChores />} />
        <Route path="/chores/all" element={<AllChores />} />
        <Route path="/distribute" element={<Distribution />} />
        <Route path="/members" element={<Members />} />
        <Route path="/statistics" element={<Statistics />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
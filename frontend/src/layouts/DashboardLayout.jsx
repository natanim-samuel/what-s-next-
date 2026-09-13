import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar.jsx";
import Topbar from "../components/layout/Topbar.jsx";
import { HouseholdProvider } from "../context/HouseholdContext.jsx";

export default function DashboardLayout() {
  return (
    <HouseholdProvider>
      <div className="flex min-h-screen bg-bg">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 px-8 py-8 max-w-5xl w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </HouseholdProvider>
  );
}
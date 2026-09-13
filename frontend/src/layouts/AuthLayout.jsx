import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="eyebrow mb-2">Household ledger</div>
          <h1 className="font-display font-semibold text-4xl text-gold">Chorely</h1>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-goldDim to-transparent mx-auto mt-4" />
        </div>
        <div className="bg-raised border border-hairline rounded p-7">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
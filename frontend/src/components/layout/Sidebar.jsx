import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/chores/mine", label: "My chores" },
  { to: "/chores/all", label: "All chores" },
  { to: "/distribute", label: "Distribution" },
  { to: "/members", label: "Members" },
  { to: "/statistics", label: "Statistics" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-56 shrink-0 border-r border-hairline bg-raised flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-hairline">
        <div className="font-display font-semibold text-2xl text-gold">Chorely</div>
      </div>
      <nav className="flex-1 py-4 font-sans text-sm">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `block px-6 py-2.5 transition-colors ${
                isActive
                  ? "text-gold border-l-2 border-gold bg-card"
                  : "text-creamDim border-l-2 border-transparent hover:text-cream"
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-5 border-t border-hairline font-sans text-sm">
        <div className="text-cream mb-2">{user?.name}</div>
        <button onClick={logout} className="text-creamDim hover:text-danger text-xs">
          Log out
        </button>
      </div>
    </aside>
  );
}
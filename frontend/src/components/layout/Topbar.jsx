import React from "react";
import { useHousehold } from "../../context/HouseholdContext.jsx";
import { Select } from "../ui/index.jsx";

export default function Topbar() {
  const { households, activeId, setActive } = useHousehold();

  return (
    <header className="h-16 border-b border-hairline flex items-center justify-between px-8">
      <div className="font-sans text-xs text-creamDim uppercase tracking-widest">
        Household
      </div>
      {households.length > 0 ? (
        <Select
          value={activeId || ""}
          onChange={(e) => setActive(e.target.value)}
          className="max-w-[220px]"
        >
          {households.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name}
            </option>
          ))}
        </Select>
      ) : (
        <span className="font-sans text-sm text-creamDim">No household yet</span>
      )}
    </header>
  );
}
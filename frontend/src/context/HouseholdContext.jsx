import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { listHouseholds } from "../services/householdService.js";
import { useAuth } from "./AuthContext.jsx";

const HouseholdContext = createContext(null);

export function HouseholdProvider({ children }) {
  const { user } = useAuth();
  const [households, setHouseholds] = useState([]);
  const [activeId, setActiveId] = useState(
    () => localStorage.getItem("chorely_household") || null
  );
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const list = await listHouseholds();
    setHouseholds(list);
    if (!activeId && list.length > 0) {
      setActiveId(String(list[0].id));
    }
    setLoading(false);
  }, [user, activeId]);

  useEffect(() => {
    if (user) refresh();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const setActive = (id) => {
    setActiveId(String(id));
    localStorage.setItem("chorely_household", String(id));
  };

  const active = households.find((h) => String(h.id) === String(activeId)) || null;

  return (
    <HouseholdContext.Provider
      value={{ households, active, activeId, setActive, refresh, loading }}
    >
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold() {
  return useContext(HouseholdContext);
}
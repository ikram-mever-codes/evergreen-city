"use client";

import { getAllTransactions, refresh } from "@/lib/api";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

const GlobalContext = createContext();

function ContextProvider({ children }) {
  const [showPanel, setShowPanel] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFetched = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (isFetched.current) return;
      isFetched.current = true;

      setLoading(true);
      try {
        const fetchedUser = await refresh();
        if (fetchedUser) {
          setUser(fetchedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        showPanel,
        setShowPanel,
        user,
        setUser,
        loading,
        setLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default ContextProvider;

export function useGlobalContext() {
  return useContext(GlobalContext);
}

"use client";

import { useState, useEffect } from "react";
import { getStoredUser, getMe, clearAuth } from "./lib/api";
import AuthView from "./components/AuthView";
import DashboardView from "./components/DashboardView";

export default function Home() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      setUser(null);
      setChecking(false);
      return;
    }
    setUser(stored);
    getMe()
      .then((me) => {
        if (me) {
          setUser(me);
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(me));
          }
        } else {
          clearAuth();
          setUser(null);
        }
      })
      .catch(() => {
        clearAuth();
        setUser(null);
      })
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading…
      </div>
    );
  }
  if (user) {
    return (
      <DashboardView
        user={user}
        onLogout={() => {
          clearAuth();
          setUser(null);
        }}
      />
    );
  }
  return <AuthView onAuth={(u) => setUser(u)} />;
}

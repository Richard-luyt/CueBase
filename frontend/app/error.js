"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "#141414",
        color: "#fff",
      }}
    >
      <h2 style={{ margin: "0 0 1rem", fontSize: "1.25rem" }}>Something went wrong</h2>
      <button
        onClick={() => reset()}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          fontWeight: 600,
          color: "#000",
          background: "#ffa3c7",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}

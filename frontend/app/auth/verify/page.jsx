"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyEmail } from "../../lib/api";

function VerifyContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    if (!token || !email) {
      setStatus("error");
      setMessage("Invalid link. Missing token or email.");
      return;
    }
    verifyEmail(token, email)
      .then(({ ok, message: msg }) => {
        setStatus(ok ? "success" : "error");
        setMessage(msg || (ok ? "Email verified. You can sign in now." : "Verification failed."));
      })
      .catch(() => {
        setStatus("error");
        setMessage("Verification failed. The link may have expired.");
      });
  }, [searchParams]);

  const containerStyle = {
    minHeight: "100vh",
    background: "#141414",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  };
  const cardStyle = {
    background: "#272727",
    borderRadius: "14px",
    padding: "2.5rem",
    maxWidth: "420px",
    width: "100%",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.1)",
  };
  const titleStyle = { color: "#fff", marginBottom: "1rem", fontSize: "1.5rem" };
  const textStyle = { color: "rgba(255,255,255,0.85)", marginBottom: "1.5rem", lineHeight: 1.5 };
  const linkStyle = {
    color: "#b6185f",
    textDecoration: "none",
    fontWeight: 600,
  };

  if (status === "loading") {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Verifying your email…</h1>
          <p style={textStyle}>Please wait.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>{status === "success" ? "Email verified" : "Verification failed"}</h1>
        <p style={textStyle}>{message}</p>
        <Link href="/" style={linkStyle}>
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "#141414",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          Loading…
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}

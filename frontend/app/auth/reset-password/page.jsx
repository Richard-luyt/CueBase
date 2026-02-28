"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPasswordWithToken } from "../../lib/api";

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
  border: "1px solid rgba(255,255,255,0.1)",
};
const titleStyle = { color: "#fff", marginBottom: "1rem", fontSize: "1.5rem" };
const textStyle = { color: "rgba(255,255,255,0.85)", marginBottom: "1.5rem", lineHeight: 1.5 };
const linkStyle = { color: "#b6185f", textDecoration: "none", fontWeight: 600 };
const inputStyle = {
  width: "100%",
  padding: "0.75rem 0.9rem",
  fontSize: "1rem",
  color: "#fff",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "10px",
  boxSizing: "border-box",
  marginBottom: "1rem",
};
const labelStyle = { display: "block", color: "#fff", marginBottom: "0.4rem", fontSize: "0.95rem" };
const submitStyle = {
  width: "100%",
  marginTop: "0.5rem",
  padding: "0.85rem",
  fontSize: "1.05rem",
  fontWeight: 600,
  color: "#fff",
  background: "#b6185f",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
};
const errorStyle = { color: "#f87171", marginBottom: "1rem", fontSize: "0.9rem" };
const successStyle = { color: "#4ade80", marginBottom: "1rem", fontSize: "0.9rem" };

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState({ text: "", isError: false });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setMessage({ text: "Passwords do not match", isError: true });
      return;
    }
    if (password.length < 8) {
      setMessage({ text: "Password must be at least 8 characters", isError: true });
      return;
    }
    setMessage({ text: "", isError: false });
    setLoading(true);
    try {
      await resetPasswordWithToken(token, { password, passwordConfirm });
      setDone(true);
      setMessage({ text: "Password reset. You can sign in now.", isError: false });
    } catch (err) {
      const msg =
        err.response?.data?.message ?? err.response?.data?.error ?? err.message ?? "Reset failed.";
      setMessage({ text: msg, isError: true });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Invalid link</h1>
          <p style={textStyle}>This reset link is invalid or missing. Request a new one from the sign-in page.</p>
          <Link href="/" style={linkStyle}>
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Password reset</h1>
          <p style={successStyle}>{message.text}</p>
          <Link href="/" style={linkStyle}>
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Reset password</h1>
        <p style={textStyle}>Enter your new password below.</p>
        {message.text && (
          <p style={message.isError ? errorStyle : successStyle}>{message.text}</p>
        )}
        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>
            New password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              style={inputStyle}
              placeholder="At least 8 characters"
            />
          </label>
          <label style={labelStyle}>
            Confirm password
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              style={inputStyle}
            />
          </label>
          <button type="submit" disabled={loading} style={submitStyle}>
            {loading ? "Resetting…" : "Reset password"}
          </button>
        </form>
        <p style={{ ...textStyle, marginTop: "1.5rem", marginBottom: 0 }}>
          <Link href="/" style={linkStyle}>
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
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
      <ResetPasswordContent />
    </Suspense>
  );
}

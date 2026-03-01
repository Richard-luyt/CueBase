"use client";

import { useState, useEffect } from "react";
import { register, login, setAuth, forgetPassword } from "../lib/api";
import styles from "./AuthView.module.css";

const TYPING_INTERVAL_MS = 150;
const CURSOR_ALONE_MS = 900;
const PAUSE_AFTER_TYPING_MS = 3800;
const DELETING_INTERVAL_MS = 120;

export default function AuthView({ onAuth }) {
  const [mode, setMode] = useState("signin");
  const [logoPhase, setLogoPhase] = useState("typing"); // "typing" | "display" | "deleting"
  const [logoTypedLength, setLogoTypedLength] = useState(0);
  const [message, setMessage] = useState({ text: "", isError: false });
  const [loading, setLoading] = useState(false);
  const [signInForm, setSignInForm] = useState({ email: "", password: "" });
  const [signUpForm, setSignUpForm] = useState({
    Username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  useEffect(() => {
    if (logoPhase === "typing") {
      if (logoTypedLength < 8) {
        const delay = logoTypedLength === 0 ? CURSOR_ALONE_MS : TYPING_INTERVAL_MS;
        const t = setTimeout(() => setLogoTypedLength((n) => n + 1), delay);
        return () => clearTimeout(t);
      }
      setLogoPhase("display");
      return;
    }
    if (logoPhase === "display") {
      const t = setTimeout(() => setLogoPhase("deleting"), PAUSE_AFTER_TYPING_MS);
      return () => clearTimeout(t);
    }
    if (logoPhase === "deleting") {
      if (logoTypedLength > 0) {
        const t = setTimeout(() => setLogoTypedLength((n) => n - 1), DELETING_INTERVAL_MS);
        return () => clearTimeout(t);
      }
      setLogoPhase("typing");
      return;
    }
  }, [logoPhase, logoTypedLength]);

  const handleSignInChange = (e) => {
    setSignInForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage({ text: "", isError: false });
  };

  const handleSignUpChange = (e) => {
    setSignUpForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage({ text: "", isError: false });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setMessage({ text: "Enter your email address", isError: true });
      return;
    }
    setMessage({ text: "", isError: false });
    setLoading(true);
    try {
      const data = await forgetPassword(forgotEmail.trim());
      if (data.status === "success") {
        setMessage({
          text: "Check your email for a link to reset your password.",
          isError: false,
        });
      } else {
        setMessage({ text: data.message || "Something went wrong", isError: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message ?? err.response?.data?.error ?? err.message ?? "Request failed.";
      setMessage({ text: msg, isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setMessage({ text: "", isError: false });
    setLoading(true);
    try {
      const data = await login({ email: signInForm.email, password: signInForm.password });
      if (data.status === "success") {
        const user = data.data?.user ?? { email: signInForm.email };
        setAuth(user);
        onAuth(user);
      } else {
        setMessage({ text: data.message || "Login failed", isError: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message ?? err.response?.data?.error ?? err.message;
      setMessage({ text: msg || "Login failed", isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setMessage({ text: "You must agree to the Terms, Disclaimer and Privacy Policy to register.", isError: true });
      return;
    }
    if (signUpForm.password !== signUpForm.passwordConfirm) {
      setMessage({ text: "Passwords do not match", isError: true });
      return;
    }
    setMessage({ text: "", isError: false });
    setLoading(true);
    try {
      const data = await register({
        Username: signUpForm.Username,
        email: signUpForm.email,
        password: signUpForm.password,
        passwordConfirm: signUpForm.passwordConfirm,
      });
      if (data.status === "success") {
        setMessage({
          text: data.message || "Check your email to verify your account, then sign in.",
          isError: false,
        });
        setMode("signin");
      } else {
        setMessage({ text: data.message || "Sign up failed", isError: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message ?? err.response?.data?.error ?? err.message;
      setMessage({ text: msg || "Sign up failed", isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.layout}>
      <div className={styles.leftPanel} aria-hidden="true">
        <div className={styles.leftPanelContent}>
          <div className={styles.logo}>
            {logoTypedLength >= 1 && <span className={styles.logoCue}>C</span>}
            {logoTypedLength >= 2 && <span className={styles.logoCue}>u</span>}
            {logoTypedLength >= 3 && <span className={styles.logoCue}>e</span>}
            {logoTypedLength >= 4 && (
              <span className={styles.logoB}>
                <span className={styles.logoArrow} aria-hidden="true">→</span>
                B
              </span>
            )}
            {logoTypedLength >= 5 && <span className={styles.logoAse}>a</span>}
            {logoTypedLength >= 6 && <span className={styles.logoAse}>s</span>}
            {logoTypedLength >= 7 && <span className={styles.logoAse}>e</span>}
            <span className={styles.logoCursor}>_</span>
          </div>
          <p className={styles.tagline1}>Your Knowledge</p>
          <p className={styles.tagline2}>
            Right on <span className={styles.cueHighlight}>Cue</span>
          </p>
        </div>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.card}>
          <h1 className={styles.title}>Welcome!</h1>
          <div className={styles.tabs}>
            <button
              type="button"
              className={mode === "signin" ? styles.tabActive : styles.tab}
              onClick={() => setMode("signin")}
            >
              Sign in
            </button>
            <button
              type="button"
              className={mode === "signup" ? styles.tabActive : styles.tab}
              onClick={() => setMode("signup")}
            >
              Sign up
            </button>
          </div>
          {message.text && (
            <p className={message.isError ? styles.error : styles.success}>{message.text}</p>
          )}
          {mode === "forgot" && (
            <form onSubmit={handleForgotPassword} className={styles.form}>
              <label className={styles.label}>
                Email
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => {
                    setForgotEmail(e.target.value);
                    setMessage({ text: "", isError: false });
                  }}
                  required
                  autoComplete="email"
                  className={styles.input}
                  placeholder="Enter the email for your account"
                />
              </label>
              <button type="submit" disabled={loading} className={styles.submit}>
                {loading ? "Sending…" : "Send reset link"}
              </button>
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={styles.forgotBack}
              >
                Back to sign in
              </button>
            </form>
          )}
          {mode === "signin" && (
            <form onSubmit={handleSignIn} className={styles.form}>
              <label className={styles.label}>
                Email
                <input
                  name="email"
                  type="email"
                  value={signInForm.email}
                  onChange={handleSignInChange}
                  required
                  autoComplete="email"
                  className={styles.input}
                />
              </label>
              <label className={styles.label}>
                Password
                <input
                  name="password"
                  type="password"
                  value={signInForm.password}
                  onChange={handleSignInChange}
                  required
                  autoComplete="current-password"
                  className={styles.input}
                />
              </label>
              <button type="submit" disabled={loading} className={styles.submit}>
                {loading ? "Signing in…" : "Sign in"}
              </button>
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className={styles.forgotLink}
              >
                Forgot password?
              </button>
            </form>
          )}
          {mode === "signup" && (
            <form onSubmit={handleSignUp} className={styles.form}>
              <label className={styles.label}>
                Username
                <input
                  name="Username"
                  type="text"
                  value={signUpForm.Username}
                  onChange={handleSignUpChange}
                  required
                  autoComplete="username"
                  className={styles.input}
                />
              </label>
              <label className={styles.label}>
                Email
                <input
                  name="email"
                  type="email"
                  value={signUpForm.email}
                  onChange={handleSignUpChange}
                  required
                  autoComplete="email"
                  className={styles.input}
                />
              </label>
              <label className={styles.label}>
                Password
                <input
                  name="password"
                  type="password"
                  value={signUpForm.password}
                  onChange={handleSignUpChange}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className={styles.input}
                />
              </label>
              <label className={styles.label}>
                Confirm password
                <input
                  name="passwordConfirm"
                  type="password"
                  value={signUpForm.passwordConfirm}
                  onChange={handleSignUpChange}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className={styles.input}
                />
              </label>
              <label className={styles.agreeRow}>
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    setMessage({ text: "", isError: false });
                  }}
                  className={styles.checkbox}
                  aria-describedby="agree-desc"
                />
                <span id="agree-desc" className={styles.agreeText}>
                  I agree to the{" "}
                  <a href="/terms-and-policies" target="_blank" rel="noopener noreferrer" className={styles.agreeLink}>
                    Terms, Disclaimer and Privacy Policy
                  </a>
                  .
                </span>
              </label>
              <button type="submit" disabled={loading} className={styles.submit}>
                {loading ? "Creating account…" : "Sign up"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

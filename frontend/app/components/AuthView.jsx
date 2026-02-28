"use client";

import { useState } from "react";
<<<<<<< HEAD
import { register, login, setAuth, forgetPassword } from "../lib/api";
=======
import { register, login, setAuth } from "../lib/api";
>>>>>>> dd8f5a074a896056978a0336688c6eb3089cfe06
import styles from "./AuthView.module.css";

export default function AuthView({ onAuth }) {
  const [mode, setMode] = useState("signin");
  const [message, setMessage] = useState({ text: "", isError: false });
  const [loading, setLoading] = useState(false);
  const [signInForm, setSignInForm] = useState({ email: "", password: "" });
  const [signUpForm, setSignUpForm] = useState({
    Username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
<<<<<<< HEAD
  const [forgotEmail, setForgotEmail] = useState("");
=======
>>>>>>> dd8f5a074a896056978a0336688c6eb3089cfe06

  const handleSignInChange = (e) => {
    setSignInForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage({ text: "", isError: false });
  };

  const handleSignUpChange = (e) => {
    setSignUpForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage({ text: "", isError: false });
  };

<<<<<<< HEAD
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

=======
>>>>>>> dd8f5a074a896056978a0336688c6eb3089cfe06
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
<<<<<<< HEAD
        setMessage({
          text: data.message || "Check your email to verify your account, then sign in.",
          isError: false,
        });
        setMode("signin");
=======
        const user = data.data?.signup ?? { Username: signUpForm.Username, email: signUpForm.email };
        setAuth(user);
        onAuth(user);
>>>>>>> dd8f5a074a896056978a0336688c6eb3089cfe06
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
      <div
        className={styles.leftPanel}
        style={{ backgroundImage: "url('/images/SigninPage.svg')" }}
        aria-hidden="true"
      />
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
<<<<<<< HEAD
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
=======
>>>>>>> dd8f5a074a896056978a0336688c6eb3089cfe06
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
<<<<<<< HEAD
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className={styles.forgotLink}
              >
                Forgot password?
              </button>
=======
>>>>>>> dd8f5a074a896056978a0336688c6eb3089cfe06
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

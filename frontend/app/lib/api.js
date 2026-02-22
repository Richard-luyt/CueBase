import axios from "axios";

const API_BASE = "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export async function register({ Username, email, password, passwordConfirm }) {
  const { data } = await api.post("/users/register", {
    Username,
    email,
    password,
    passwordConfirm,
  });
  return data;
}

export async function login({ email, password }) {
  const { data } = await api.post("/users/login", { email, password });
  return data;
}

/** Store only user in localStorage; token stays in httpOnly cookie. */
export function setAuth(user) {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem("user", JSON.stringify(user));
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("user");
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  const userJson = localStorage.getItem("user");
  return userJson ? JSON.parse(userJson) : null;
}

/** Validate cookie by calling protected /me. Returns current user or null. */
export async function getMe() {
  try {
    const { data } = await api.get("/users/me");
    const user = data?.data?.user ?? data?.user ?? data?.data ?? null;
    return user;
  } catch {
    return null;
  }
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("singleFile", file);
  const { data } = await api.post("/doc/uploadDoc", formData, {
    headers: { "Content-Type": undefined },
  });
  return data;
}

export async function getDocuments() {
  const { data } = await api.get("/doc/getDoc");
  return data;
}

export async function deleteDocument(FileName) {
  const { data } = await api.post("/doc/deleteDoc", { FileName });
  return data;
}

export async function queryDocuments(prompt, mode) {
  const body = { prompt: prompt || "" };
  if (mode) body.mode = mode;
  const { data } = await api.post("/doc/queryDoc", body);
  return data;
}

/**
 * Query documents via SSE stream. Calls onChunk(text) for each fragment, onDone() when stream ends, onError(err) on failure.
 * Uses fetch with credentials so the auth cookie is sent.
 */
export async function queryDocumentsStream(prompt, mode, { onChunk, onDone, onError }) {
  const body = JSON.stringify({
    prompt: prompt || "",
    ...(mode ? { mode } : {}),
  });
  let response;
  try {
    response = await fetch(`${API_BASE}/doc/queryDoc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body,
    });
  } catch (err) {
    onError?.(err);
    return;
  }
  if (!response.ok) {
    let message = "Query failed";
    try {
      const data = await response.json();
      message = data?.message ?? data?.error ?? message;
    } catch (_) {}
    onError?.(new Error(typeof message === "string" ? message : JSON.stringify(message)));
    return;
  }
  const reader = response.body?.getReader();
  if (!reader) {
    onError?.(new Error("No response body"));
    return;
  }
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") {
            onDone?.();
            return;
          }
          try {
            const obj = JSON.parse(payload);
            if (obj?.text != null) onChunk?.(String(obj.text));
          } catch (_) {
            // ignore malformed chunk
          }
        }
      }
    }
    if (buffer.startsWith("data: ")) {
      const payload = buffer.slice(6).trim();
      if (payload !== "[DONE]") {
        try {
          const obj = JSON.parse(payload);
          if (obj?.text != null) onChunk?.(String(obj.text));
        } catch (_) {}
      }
    }
    onDone?.();
  } catch (err) {
    onError?.(err);
  }
}

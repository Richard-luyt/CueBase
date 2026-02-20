import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function register({ Username, email, password, passwordConfirm }) {
  const { data } = await api.post('/users/register', {
    Username,
    email,
    password,
    passwordConfirm,
  });
  return data;
}

export async function login({ email, password }) {
  const { data } = await api.post('/users/login', { email, password });
  return data;
}

export function setAuth(token, user) {
  if (token) localStorage.setItem('token', token);
  if (user) localStorage.setItem('user', JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getStoredAuth() {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  return { token, user };
}

/**
 * Upload a PDF file to the backend (POST /api/doc/uploadDoc).
 * Backend expects multipart field name: singleFile
 */
export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('singleFile', file);
  const { data } = await api.post('/doc/uploadDoc', formData, {
    headers: { 'Content-Type': undefined },
  });
  return data;
}

/**
 * Get current user's documents (GET /api/doc/getDoc).
 * Returns { status, data } where data is [{ FileName, UploadTime }, ...].
 */
export async function getDocuments() {
  const { data } = await api.get('/doc/getDoc');
  return data;
}

/**
 * Delete a document by name (POST /api/doc/deleteDoc).
 * Backend expects body: { FileName }.
 */
export async function deleteDocument(FileName) {
  const { data } = await api.post('/doc/deleteDoc', { FileName });
  return data;
}

/**
 * Query documents (POST /api/doc/queryDoc).
 * Sends { prompt, mode? }. Backend returns { status, message } (AI-generated answer).
 * mode: "strict" = only from knowledge base; otherwise can supplement with model knowledge.
 */
export async function queryDocuments(prompt, mode) {
  const body = { prompt: prompt || '' };
  if (mode) body.mode = mode;
  const { data } = await api.post('/doc/queryDoc', body);
  return data;
}

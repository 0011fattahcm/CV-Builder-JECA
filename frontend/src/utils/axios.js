// src/utils/axios.js
import axios from "axios";

// Ambil base dari env Vite (TANPA /api), fallback ke localhost:5000
const raw = (import.meta.env.VITE_API_URL || "https://api.cvbuilderjeca.com").trim();

// Hapus trailing slash biar gak dobel slash
const baseURL = raw.replace(/\/+$/, "");

const instance = axios.create({
  baseURL,            // ⬅️ JANGAN pakai `/api` di sini
  withCredentials: true,
  timeout: 30000,
});

// (opsional) interceptor error global
// instance.interceptors.response.use(
//   (res) => res,
//   (err) => Promise.reject(err)
// );

export default instance;

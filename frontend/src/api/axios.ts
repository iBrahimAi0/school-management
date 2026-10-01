// src/api/axios.ts
import axios from "axios";

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
    /* "Content-Type": "application/json", */
  },
  withCredentials: true,
});

// src/api/axios.ts
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Clear the current active role cookie
      document.cookie =
        "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    }
    return Promise.reject(error);
  },
);

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

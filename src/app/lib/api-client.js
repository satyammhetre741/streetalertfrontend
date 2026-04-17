import axios from "axios";
import { env } from "@/app/config/env";
import { tokenStorage } from "@/app/lib/token-storage";

let onUnauthorized = null;

export const apiClient = axios.create({ baseURL: env.apiBaseUrl });

const createBase64 = (payload) => {
  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  return normalized.padEnd(normalized.length + ((4 - (normalized.length % 4 || 4)) % 4), "=");
};

const decodeJwtExp = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decodedPayload = atob(createBase64(payload));
    const decoded = JSON.parse(decodedPayload);
    return decoded.exp ?? null;
  } catch {
    return null;
  }
};

const isJwtExpired = (token) => {
  const exp = decodeJwtExp(token);
  if (!exp) return false;
  return exp * 1000 <= Date.now() + 5000;
};

export const registerUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

apiClient.interceptors.request.use((config) => {
  const requestUrl = String(config.url ?? "");
  const isAuthEndpoint = requestUrl.startsWith("/api/auth/") || requestUrl.startsWith("/auth/");
  if (isAuthEndpoint) {
    return config;
  }

  const accessToken = tokenStorage.getAccessToken();
  if (accessToken && !isJwtExpired(accessToken)) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    if (originalRequest && status === 401) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

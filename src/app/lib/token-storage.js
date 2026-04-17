import { env } from "@/app/config/env";

const ACCESS_TOKEN_KEY = "street-alert.access-token";

let inMemoryAccessToken = null;

export const tokenStorage = {
  getAccessToken: () => {
    if (inMemoryAccessToken) return inMemoryAccessToken;
    if (env.persistAccessToken) return localStorage.getItem(ACCESS_TOKEN_KEY);
    return null;
  },
  setAccessToken: (token) => {
    inMemoryAccessToken = token;
    if (env.persistAccessToken) {
      if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token);
      else localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  },
  clear: () => {
    inMemoryAccessToken = null;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};

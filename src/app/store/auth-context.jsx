import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { registerUnauthorizedHandler } from "@/app/lib/api-client";
import { tokenStorage } from "@/app/lib/token-storage";

const AuthContext = createContext(null);

const createBase64 = (payload) => {
  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  return normalized.padEnd(normalized.length + ((4 - (normalized.length % 4 || 4)) % 4), "=");
};

const readJwtExp = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(createBase64(payload)));
    return decoded.exp ?? null;
  } catch {
    return null;
  }
};

const isTokenProbablyValid = (token) => {
  if (!token) return false;
  const exp = readJwtExp(token);
  if (!exp) return true;
  return exp * 1000 > Date.now() + 5000;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const hardLogout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      hardLogout();
    });
  }, [hardLogout]);

  useEffect(() => {
    const accessToken = tokenStorage.getAccessToken();
    if (!isTokenProbablyValid(accessToken)) {
      hardLogout();
      setIsInitializing(false);
      return;
    }

    if (accessToken) {
      try {
        const payload = JSON.parse(atob(createBase64(accessToken.split(".")[1])));
        setUser({
          userId: payload.userId ?? null,
          username: payload.sub ?? null,
          role: payload.role?.replace("ROLE_", "") ?? "USER",
        });
      } catch {
        hardLogout();
      }
    }

    setIsInitializing(false);
  }, [hardLogout]);

  const loginSuccess = useCallback((payload) => {
    tokenStorage.setAccessToken(payload.token);
    setUser({
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
    });
  }, []);

  const logout = useCallback(async () => {
    hardLogout();
  }, [hardLogout]);

  const value = {
    user,
    isInitializing,
    isAuthenticated: Boolean(user),
    loginSuccess,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
};

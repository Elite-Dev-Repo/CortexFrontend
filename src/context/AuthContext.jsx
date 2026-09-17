/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import tokenStorage from "@/lib/tokenStorage";
import { setUnauthorizedHandler } from "@/lib/api";
import * as authApi from "@/lib/authApi";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => tokenStorage.isAuthenticated());
  const [isLoading, setIsLoading] = useState(false);

  // Keep isAuthenticated in sync across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "access" || e.key === "refresh" || e.key === null) {
        setIsAuthenticated(tokenStorage.isAuthenticated());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Register unauthorized handler for api interceptor (SPA-friendly logout)
  useEffect(() => {
    setUnauthorizedHandler(() => setIsAuthenticated(false));
    return () => setUnauthorizedHandler(null);
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authApi.login(email, password);
      if (!data?.access) throw new Error("Invalid login response: missing access token");
      tokenStorage.setTokens({ access: data.access, refresh: data.refresh });
      setIsAuthenticated(true);
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (username, email, password) => {
    setIsLoading(true);
    try {
      const data = await authApi.register(username, email, password);
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(async (code) => {
    setIsLoading(true);
    try {
      const data = await authApi.verifyEmail(code);
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resendOtp = useCallback(async (email) => {
    const data = await authApi.resendOtp(email);
    return data;
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      login,
      register,
      verifyEmail,
      resendOtp,
      logout,
    }),
    [isAuthenticated, isLoading, login, register, verifyEmail, resendOtp, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

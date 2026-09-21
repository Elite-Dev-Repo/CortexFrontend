import api from "./api";

/**
 * Pure API layer - no side effects on storage or navigation.
 * Token persistence and auth state are handled by AuthContext via tokenStorage.
 */

export const login = async (email, password) => {
  const { data } = await api.post("/token/", { email, password });
  return data;
};

export const register = async (username, email, password) => {
  const { data } = await api.post("/register/", { username, email, password });
  return data;
};

export const verifyEmail = async (code) => {
  const { data } = await api.post("/verify-email/", { code });
  return data;
};

export const resendOtp = async (email) => {
  const { data } = await api.post("/resend-otp/", { email });
  return data;
};

export const refreshToken = async (refresh) => {
  const { data } = await api.post("/token/refresh/", { refresh });
  return data;
};

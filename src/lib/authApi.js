import api from "./api";
import { ACCESS, REFRESH } from "./constants";

export const login = async (email, password) => {
  const { data } = await api.post("/token/", { email, password });
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
  localStorage.setItem(ACCESS, data.access);
  localStorage.setItem(REFRESH, data.refresh);
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

export const logout = () => {
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
  window.location.href = "/auth";
};

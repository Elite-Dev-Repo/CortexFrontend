import axios from "axios";
import tokenStorage from "./tokenStorage";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Unauthorized handler (decoupled from window) ---
let onUnauthorized = null;

/**
 * Register a callback invoked on definitive auth failure (no refresh token or refresh failed).
 * AuthProvider sets this to update React state + navigate via SPA router.
 * Falls back to hard redirect if no handler registered.
 */
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = typeof fn === "function" ? fn : null;
};

const handleUnauthorized = () => {
  tokenStorage.clear();
  if (onUnauthorized) {
    onUnauthorized();
  } else {
    window.location.href = "/auth";
  }
};

// --- Request interceptor: attach access token ---
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// --- Response interceptor: refresh queue ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Endpoints that should never trigger refresh logic (avoid loops)
const SKIP_REFRESH_URLS = ["/token/", "/token/refresh/", "/register/", "/verify-email/", "/resend-otp/"];

const shouldSkipRefresh = (url = "") => SKIP_REFRESH_URLS.some((path) => url.includes(path));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // No response or no config -> network error, just reject
    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const is401 = error.response.status === 401;
    const alreadyRetried = Boolean(originalRequest._retry);
    const skipRefresh = shouldSkipRefresh(originalRequest.url || "");

    if (!is401 || alreadyRetried || skipRefresh) {
      return Promise.reject(error);
    }

    // Queue concurrent 401s while refresh is in flight
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      isRefreshing = false;
      handleUnauthorized();
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post(`${BASE_URL}/token/refresh/`, {
        refresh: refreshToken,
      });

      // Backend may return { access } or { access, refresh } on rotation
      const newAccess = data.access;
      if (!newAccess) throw new Error("No access token in refresh response");

      tokenStorage.setAccessToken(newAccess);
      if (data.refresh) tokenStorage.setRefreshToken(data.refresh);

      processQueue(null, newAccess);

      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      handleUnauthorized();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;

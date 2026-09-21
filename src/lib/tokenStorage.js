/**
 * Centralized token persistence.
 * Single source of truth for auth tokens - no other module should touch localStorage directly.
 */

const ACCESS_KEY = "access";
const REFRESH_KEY = "refresh";

// Re-export for callers that need raw key names (e.g. storage events)
export const TOKEN_KEYS = {
  ACCESS: ACCESS_KEY,
  REFRESH: REFRESH_KEY,
};

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage may be unavailable (e.g. private mode); fail silently
  }
}

function safeRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export const tokenStorage = {
  getAccessToken() {
    return safeGet(ACCESS_KEY);
  },

  getRefreshToken() {
    return safeGet(REFRESH_KEY);
  },

  /**
   * Persist tokens atomically. Pass null/undefined to skip a token.
   */
  setTokens({ access, refresh }) {
    if (access) safeSet(ACCESS_KEY, access);
    if (refresh) safeSet(REFRESH_KEY, refresh);
  },

  setAccessToken(token) {
    if (token) safeSet(ACCESS_KEY, token);
  },

  setRefreshToken(token) {
    if (token) safeSet(REFRESH_KEY, token);
  },

  clear() {
    safeRemove(ACCESS_KEY);
    safeRemove(REFRESH_KEY);
  },

  isAuthenticated() {
    return Boolean(safeGet(ACCESS_KEY));
  },
};

export default tokenStorage;

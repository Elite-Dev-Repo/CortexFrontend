/**
 * Normalize API errors to a user-facing string.
 * Mirrors DRF error shapes: { detail, email:[], username:[], password:[], non_field_errors:[], error }
 */

export const getErrorMessage = (err, fallback = "Something went wrong. Please try again.") => {
  if (!err?.response) {
    // Network / CORS / server down
    if (err?.message?.includes("Network Error")) return "Unable to reach server. Check your connection.";
    return "Server unavailable. Please try again later.";
  }

  const data = err.response.data;
  if (!data) return fallback;

  if (typeof data.detail === "string") return data.detail;
  if (typeof data.error === "string") return data.error;
  if (Array.isArray(data.error) && data.error[0]) return data.error[0];
  if (Array.isArray(data.email) && data.email[0]) return data.email[0];
  if (Array.isArray(data.username) && data.username[0]) return data.username[0];
  if (Array.isArray(data.password) && data.password[0]) return data.password[0];
  if (Array.isArray(data.non_field_errors) && data.non_field_errors[0]) return data.non_field_errors[0];
  if (Array.isArray(data.code) && data.code[0]) return data.code[0];

  // Generic: first string value in object
  for (const v of Object.values(data)) {
    if (typeof v === "string") return v;
    if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  }

  return fallback;
};

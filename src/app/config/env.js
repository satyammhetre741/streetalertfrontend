export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "",
  persistAccessToken: import.meta.env.VITE_PERSIST_ACCESS_TOKEN === "true",
};

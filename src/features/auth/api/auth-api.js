import { apiClient } from "@/app/lib/api-client";

export const authApi = {
  login: async (payload) => (await apiClient.post("/api/auth/login", payload)).data,
  register: async (payload) => (await apiClient.post("/api/auth/register", payload)).data,
};

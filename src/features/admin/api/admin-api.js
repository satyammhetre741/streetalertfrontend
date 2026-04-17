import { apiClient } from "@/app/lib/api-client";

export const adminApi = {
  triggerFetch: async () => {
    await apiClient.post("/api/admin/news/fetch");
  },
  fetchLogs: async () => (await apiClient.get("/api/admin/news/fetch-logs")).data,
  listKeywordRules: async () => (await apiClient.get("/api/admin/keyword-rules")).data,
  createKeywordRule: async (payload) => (await apiClient.post("/api/admin/keyword-rules", payload)).data,
  updateKeywordRule: async (ruleId, payload) => (await apiClient.put(`/api/admin/keyword-rules/${ruleId}`, payload)).data,
  deleteKeywordRule: async (ruleId) => {
    await apiClient.delete(`/api/admin/keyword-rules/${ruleId}`);
  },
};

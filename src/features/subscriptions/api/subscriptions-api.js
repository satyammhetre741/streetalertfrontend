import { apiClient } from "@/app/lib/api-client";

export const subscriptionsApi = {
  list: async () => (await apiClient.get("/api/subscriptions")).data,
  create: async (payload) => (await apiClient.post("/api/subscriptions", payload)).data,
  update: async (subscriptionId, payload) => (await apiClient.put(`/api/subscriptions/${subscriptionId}`, payload)).data,
  remove: async (subscriptionId) => {
    await apiClient.delete(`/api/subscriptions/${subscriptionId}`);
  },
};

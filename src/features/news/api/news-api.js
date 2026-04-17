import { apiClient } from "@/app/lib/api-client";

export const newsApi = {
  list: async (query) =>
    (
      await apiClient.get("/api/news", {
        params: {
          sector: query.sector || undefined,
          impact: query.impact || undefined,
        },
      })
    ).data,
};

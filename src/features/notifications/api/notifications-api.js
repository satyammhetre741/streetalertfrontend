import { apiClient } from "@/app/lib/api-client";

export const notificationsApi = {
  list: async () => (await apiClient.get("/api/notifications")).data,
  unreadCount: async () => (await apiClient.get("/api/notifications/unread-count")).data,
  markAsRead: async (notificationId) => {
    await apiClient.patch(`/api/notifications/${notificationId}/read`);
  },
};

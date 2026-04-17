import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { notificationsApi } from "@/features/notifications/api/notifications-api";
import { formatDateTime } from "@/shared/utils/format";

export function NotificationRow({ notification }) {
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAsRead(notification.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications", "list"] });
      const previousList = queryClient.getQueryData(["notifications", "list"]);

      queryClient.setQueryData(["notifications", "list"], (current = []) =>
        current.map((item) => (item.id === notification.id ? { ...item, read: true } : item)),
      );
      queryClient.setQueryData(["notifications", "unreadCount"], (current) => ({
        count: Math.max(0, (current?.count ?? 0) - (notification.read ? 0 : 1)),
      }));

      return { previousList };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["notifications", "list"], context?.previousList);
      queryClient.invalidateQueries({ queryKey: ["notifications", "unreadCount"] });
      toast.error("Unable to mark as read.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "list"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unreadCount"] });
    },
  });

  return (
    <article className={`card notification-card ${notification.read ? "read" : ""}`}>
      <div className="row space-between">
        <div className="row">
          <span className="pill">{notification.sector}</span>
          <span className="pill">{notification.impact}</span>
        </div>
        <small className="muted">{formatDateTime(notification.createdAt)}</small>
      </div>
      <p>{notification.message}</p>
      {!notification.read ? (
        <button className="button button-outline" onClick={() => markAsReadMutation.mutate()}>
          Mark as read
        </button>
      ) : null}
    </article>
  );
}

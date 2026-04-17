import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "@/features/notifications/api/notifications-api";
import { NotificationRow } from "@/features/notifications/components/notification-row";
import { StatusState } from "@/shared/components/status-state";

export function NotificationsPage() {
  const query = useQuery({
    queryKey: ["notifications", "list"],
    queryFn: notificationsApi.list,
  });

  if (query.isLoading) return <StatusState title="Loading notifications..." />;
  if (query.isError) {
    return <StatusState title="Failed to load notifications" description={query.error.response?.data?.message ?? "Try again shortly."} />;
  }
  if (!query.data?.length) return <StatusState title="No notifications yet" description="You're all caught up." />;

  return (
    <section className="stack">
      {query.data.map((notification) => (
        <NotificationRow key={notification.id} notification={notification} />
      ))}
    </section>
  );
}

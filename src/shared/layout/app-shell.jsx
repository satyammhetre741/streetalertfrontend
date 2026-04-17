import { NavLink, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useAuth } from "@/app/store/auth-context";
import { notificationsApi } from "@/features/notifications/api/notifications-api";

function NavItem({ to, label, badge }) {
  return (
    <NavLink to={to} className={({ isActive }) => clsx("menu-item", isActive && "menu-item-active")}>
      <span>{label}</span>
      {badge ? <span className="badge">{badge}</span> : null}
    </NavLink>
  );
}

export function AppShell() {
  const { user, logout } = useAuth();

  const unreadQuery = useQuery({
    queryKey: ["notifications", "unreadCount"],
    queryFn: notificationsApi.unreadCount,
    enabled: Boolean(user),
    refetchInterval: 30000,
  });

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">Street Alert</div>
        <nav className="menu">
          <NavItem to="/dashboard" label="Dashboard" />
          <NavItem to="/notifications" label="Notifications" badge={unreadQuery.data?.count ? String(unreadQuery.data.count) : undefined} />
          <NavItem to="/subscriptions" label="Subscriptions" />
          {user?.role === "ADMIN" ? <NavItem to="/admin" label="Admin" /> : null}
        </nav>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <div>
            <h1 className="app-title">Street Alert</h1>
            <p className="muted">
              {user?.username} ({user?.role})
            </p>
          </div>
          <button className="button button-outline" onClick={() => void logout()}>
            Logout
          </button>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

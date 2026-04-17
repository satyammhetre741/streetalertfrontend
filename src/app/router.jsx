import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "@/app/store/auth-context";
import { FullPageLoader } from "@/shared/components/full-page-loader";
import { LoginPage } from "@/features/auth/pages/login-page";
import { RegisterPage } from "@/features/auth/pages/register-page";
import { DashboardPage } from "@/features/news/pages/dashboard-page";
import { NotificationsPage } from "@/features/notifications/pages/notifications-page";
import { SubscriptionsPage } from "@/features/subscriptions/pages/subscriptions-page";
import { AdminPage } from "@/features/admin/pages/admin-page";
import { AppShell } from "@/shared/layout/app-shell";

const ProtectedRoute = () => {
  const { isAuthenticated, isInitializing } = useAuth();
  if (isInitializing) return <FullPageLoader label="Initializing session..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const GuestRoute = () => {
  const { isAuthenticated, isInitializing } = useAuth();
  if (isInitializing) return <FullPageLoader label="Initializing session..." />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

const AdminRoute = () => {
  const { user } = useAuth();
  if (user?.role !== "ADMIN") return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

export function AppRouter() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

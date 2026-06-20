import { Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import { LoginPage } from '@/pages/login/LoginPage';
import { RegisterPage } from '@/pages/register/RegisterPage';
import { DashboardLayout } from '@/pages/dashboard/DashboardLayout';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { TodosPage } from '@/pages/todos/TodosPage';
import { NotesPage } from '@/pages/notes/NotesPage';
import { NotificationsPage } from '@/pages/notifications/NotificationsPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';

export function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route path={ROUTES.register} element={<RegisterPage />} />

      {/* Protected layout */}
      <Route path={ROUTES.dashboard} element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
      </Route>
      <Route path={ROUTES.todos} element={<DashboardLayout />}>
        <Route index element={<TodosPage />} />
      </Route>
      <Route path={ROUTES.notes} element={<DashboardLayout />}>
        <Route index element={<NotesPage />} />
      </Route>
      <Route path={ROUTES.notifications} element={<DashboardLayout />}>
        <Route index element={<NotificationsPage />} />
      </Route>
      <Route path={ROUTES.profile} element={<DashboardLayout />}>
        <Route index element={<ProfilePage />} />
      </Route>

      {/* Root redirect */}
      <Route path={ROUTES.home} element={<Navigate to={ROUTES.login} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
    </Routes>
  );
}

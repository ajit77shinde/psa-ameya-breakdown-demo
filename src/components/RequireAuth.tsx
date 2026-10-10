import { Navigate } from 'react-router-dom';
import { useDemoStore } from '../store/DemoStore';
import type { Role } from '../types';

export function RequireAuth({
  role,
  children,
}: {
  role?: Role | Role[];
  children: React.ReactNode;
}) {
  const { currentUser } = useDemoStore();
  if (!currentUser) return <Navigate to="/" replace />;
  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    if (!roles.includes(currentUser.role)) {
      if (currentUser.role === 'driver') return <Navigate to="/driver" replace />;
      if (currentUser.role === 'technician')
        return <Navigate to="/tech" replace />;
      return <Navigate to="/admin" replace />;
    }
  }
  return <>{children}</>;
}

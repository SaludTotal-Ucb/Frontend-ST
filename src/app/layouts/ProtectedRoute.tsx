import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
};

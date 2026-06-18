import React, { useEffect, useState } from "react";
import { authApi } from "../api/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authApi.testProtected();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
        window.location.href = "/login";
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Загрузка...</div>;
  }

  return <>{children}</>;
};

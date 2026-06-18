import { useState } from "react";
import { authApi, LoginData, RegisterData } from "../api/auth";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.login(data);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка входа");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.register(data);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка регистрации");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    document.cookie = "jwt_access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "jwt_refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };

  return {
    login,
    register,
    logout,
    isLoading,
    error,
  };
};

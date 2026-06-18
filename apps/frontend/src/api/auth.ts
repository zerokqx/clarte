import { apiClient } from "./client";

export interface LoginData {
  login: string;
  password: string;
}

export interface RegisterData {
  login: string;
  password: string;
}

export const authApi = {
  login: async (data: LoginData): Promise<{ success: boolean }> => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<void> => {
    await apiClient.post("/auth/register", data);
  },

  validate: async (): Promise<any> => {
    const response = await apiClient.post("/auth/validate", {});
    return response.data;
  },

  testProtected: async (): Promise<any> => {
    const response = await apiClient.get("/auth/test-protected");
    return response.data;
  },
};

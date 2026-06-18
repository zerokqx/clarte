import { apiClient } from "./client";

export interface User {
  id: string;
  login: string;
  avatarUrl?: string;
}

export const userApi = {
  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/id/${id}`);
    return response.data;
  },

  getUserByLogin: async (login: string): Promise<User> => {
    const response = await apiClient.get(`/users/login/${login}`);
    return response.data;
  },
};

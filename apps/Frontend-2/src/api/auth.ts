import { apiClient } from './client';

export const authApi = {
  register: async (data: { login: string; password: string }) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { login: string; password: string }) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  check: async () => {
    const response = await apiClient.get('/auth/check');
    return response.data;
  },

  refresh: async () => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },
};

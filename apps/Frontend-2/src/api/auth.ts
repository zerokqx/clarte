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

  validate: async () => {
    const response = await apiClient.post('/auth/validate', {});
    return response.data;
  },

  testProtected: async () => {
    const response = await apiClient.get('/auth/test-protected');
    return response.data;
  },
};

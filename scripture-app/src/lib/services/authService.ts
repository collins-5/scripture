import * as SecureStore from 'expo-secure-store';
import { apiClient } from './apiClient';

type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const authService = {
  async login(email: string, password: string) {
    const data = await apiClient('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), password }),
    });
    if (data.token) {
      await SecureStore.setItemAsync('authToken', data.token);
    }
    return data;
  },

  async register({ firstName, lastName, email, password }: RegisterPayload) {
    const data = await apiClient('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      }),
    });
    if (data.token) {
      await SecureStore.setItemAsync('authToken', data.token);
    }
    return data;
  },

  async me() {
    return apiClient('/api/auth/me');
  },

  async logout() {
    try {
      await apiClient('/api/auth/logout', { method: 'POST' });
    } catch {}
    await SecureStore.deleteItemAsync('authToken');
  },

  async getToken() {
    return SecureStore.getItemAsync('authToken');
  },
};
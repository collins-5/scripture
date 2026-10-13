import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  if (!BASE_URL) {
    throw new Error('API base configuration variable is missing.');
  }

  const token = await SecureStore.getItemAsync('authToken');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, { ...options, headers });

  let data: any = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const err: any = new Error(data?.message || `Request failed (${response.status})`);
    err.status = response.status;
    err.url = url;
    throw err;
  }

  return data;
};
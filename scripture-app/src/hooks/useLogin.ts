import { useState } from 'react';
import { router } from 'expo-router';
import { authService } from '@/lib/services/authService';
import { useAuthStore } from '@/stores/authStore';

export function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useAuthStore((s) => s.signIn);

  const validateForm = () => {
    setError(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !password) {
      setError('All fields are required.');
      return false;
    }
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setError(null);
    try {
      const { user, token } = await authService.login(email.trim(), password);
      await signIn(user, token);
      router.replace('/(tabs)');
    } catch {
      setError('Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    setError,
    handleLogin,
  };
}
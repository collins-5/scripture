import { useState } from 'react';
import { router } from 'expo-router';
import { authService } from '@/lib/services/authService';
import { useAuthStore } from '@/stores/authStore';

export type RegisterErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  server?: string;
};

export function useRegister() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});

  const signIn = useAuthStore((s) => s.signIn);

  const validateForm = () => {
    const newErrors: RegisterErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required.';

    if (!email.trim()) newErrors.email = 'Email is required.';
    else if (!emailRegex.test(email.trim()))
      newErrors.email = 'Please enter a valid email address.';

    if (!password) newErrors.password = 'Password is required.';
    else if (password.length < 6)
      newErrors.password = 'Password must be at least 6 characters long.';

    if (!confirmPassword)
      newErrors.confirmPassword = 'Please confirm your password.';
    else if (password !== confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    try {
      const { user, token } = await authService.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });
      if (token && user) {
        await signIn(user, token);
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    } catch (error: any) {
      setErrors({
        server: error.message || 'Registration failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    errors,
    handleRegister,
  };
}
import { selectIsAuthenticated, useAuthStore } from "@/stores/authStore";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const signOut = useAuthStore((s) => s.signOut);
  return { user, status, isAuthenticated, signOut };
}
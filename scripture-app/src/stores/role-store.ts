import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Role = 'parent' | 'teacher' | 'driver' | 'admin';

type RoleState = {
  roles: Role[];
  activeRole: Role | null;
  setRoles: (roles: Role[]) => void;
  setActiveRole: (role: Role) => void;
  hydrate: () => Promise<void>;
};

export const useRoleStore = create<RoleState>((set, get) => ({
  roles: [],
  activeRole: null,
  setRoles: (roles) => {
    const current = get().activeRole;
    const next = current && roles.includes(current) ? current : roles[0] ?? null;
    set({ roles, activeRole: next });
    if (next) AsyncStorage.setItem('active-role', next);
  },
  setActiveRole: (role) => {
    set({ activeRole: role });
    AsyncStorage.setItem('active-role', role);
  },
  hydrate: async () => {
    const saved = await AsyncStorage.getItem('active-role');
    if (saved) set({ activeRole: saved as Role });
  },
}));
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      userId: null,
      roleId: null,
      setAuth: (token, userId, roleId) => set({ token, userId, roleId }),
      clearAuth: () => set({ token: null, userId: null, roleId: null }),
    }),
    {
      name: "auth-store",
      getStorage: () => localStorage,
    },
  ),
);

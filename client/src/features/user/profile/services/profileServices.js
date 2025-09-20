// src/features/user/profile/services/profileServices.js
import axiosClient from "../../../../services/config/axiosClient.js";
import { useAuthStore } from "../../../../store/useAuthStore.js";
import { useApiWithFallback } from "../../../../services/useApiWithFallback.js";
import { useUserId } from "../../../../hooks/useUserId.js";

// --- Demo / fallback profile ---
const demoProfile = {
  id: "user_002",
  name: "Jil Varghese Palliyan",
  email: "j@e.com",
  role: "Passenger",
  roleId: 2,
};

// Helper: attach token header
const createAuthHeaders = (token) =>
  token ? { Authorization: `Bearer ${token}` } : {};

// --- Hook: Get logged-in user profile ---
export const useGetProfile = () => {
  const token = useAuthStore((state) => state.token);
  const userId = useUserId();

  return useApiWithFallback({
    fallbackKey: `profileByUser_${userId || "fallback"}`,
    endpoint: async () => {
      // Return demo profile if no userId
      if (!userId) return { ...demoProfile, isFallback: true };

      const res = await axiosClient.get(`/users/${userId}`, {
        headers: createAuthHeaders(token),
      });

      return { ...res.data, isFallback: false };
    },
    fallbackData: { ...demoProfile, isFallback: true },
  });
};

// --- Hook: Update logged-in user profile ---
export const useUpdateProfile = () => {
  const token = useAuthStore((state) => state.token);
  const userId = useUserId();

  return async (data) => {
    // If no userId, update demo profile locally
    if (!userId) {
      return { ...demoProfile, ...data, isFallback: true };
    }

    const res = await axiosClient.put(`/users/${userId}`, data, {
      headers: createAuthHeaders(token),
    });

    return { ...res.data, isFallback: false };
  };
};

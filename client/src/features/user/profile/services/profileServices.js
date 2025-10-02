// src/features/user/profile/services/profileServices.js
import axiosClient from "../../../../services/config/axiosClient.js";
import { useAuthStore } from "../../../../store/useAuthStore.js";
import { useApiWithFallback } from "../../../../services/useApiWithFallback.js";
import { useUserId } from "../../../../hooks/useUserId.js";

// Helper: attach token header
const createAuthHeaders = (token) =>
  token ? { Authorization: `Bearer ${token}` } : {};

// --- Hook: Get logged-in user profile ---
export const useGetProfile = () => {
  const token = useAuthStore((state) => state.token);
  const userId = useUserId();

  return useApiWithFallback({
    fallbackKey: `profileByUser_${userId || "no_user"}`,
    endpoint: async () => {
      if (!userId) {
        throw new Error("No user ID available");
      }

      const res = await axiosClient.get(`/users/${userId}`, {
        headers: createAuthHeaders(token),
      });

      return res.data;
    },
  });
};

// --- Hook: Update logged-in user profile ---
export const useUpdateProfile = () => {
  const token = useAuthStore((state) => state.token);
  const userId = useUserId();

  return async (data) => {
    if (!userId) {
      throw new Error("No user ID available for profile update");
    }

    const res = await axiosClient.put(`/users/${userId}`, data, {
      headers: createAuthHeaders(token),
    });

    return res.data;
  };
};

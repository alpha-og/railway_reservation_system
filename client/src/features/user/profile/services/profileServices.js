// src/features/user/profile/services/profileServices.js
import axiosClient from "../../../../services/config/axiosClient.js";
import { useAuthStore } from "../../../../store/useAuthStore.js";

// Helper: attach token header
const createAuthHeaders = (token) =>
  token ? { Authorization: `Bearer ${token}` } : {};

// --- Hook: Update logged-in user profile ---
export const useUpdateProfile = () => {
  const token = useAuthStore((state) => state.token);

  return async (data) => {
    // Remove password from data since backend doesn't support it
    const { password, ...profileData } = data;
    
    const res = await axiosClient.patch(`/profile/update`, profileData, {
      headers: createAuthHeaders(token),
    });

    return res.data.data.profile;
  };
};

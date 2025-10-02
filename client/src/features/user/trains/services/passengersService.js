import { useMemo } from "react";
import axiosClient from "../../../../services/config/axiosClient";
import { useAuthStore } from "../../../../store/useAuthStore";
import { useApiWithFallback } from "../../../../services/useApiWithFallback";
import { useUserId } from "../../../../hooks/useUserId";

// Fallback data for when API is not available
const fallbackPassengers = [
  { id: "1", name: "Alice Johnson", age: 28, gender: "Female", email: "alice@example.com" },
  { id: "2", name: "Bob Smith", age: 35, gender: "Male", email: "bob@example.com" },
  { id: "3", name: "Charlie Brown", age: 22, gender: "Male", email: "charlie@example.com" },
];

const createAuthHeaders = (token) =>
  token ? { Authorization: `Bearer ${token}` } : {};

// Hook: Get saved passengers for current user
export const useGetSavedPassengers = () => {
  const token = useAuthStore((state) => state.token);
  const userId = useUserId();

  const endpoint = useMemo(() => {
    return async () => {
      if (!userId) return fallbackPassengers;

      const res = await axiosClient.get("/profile/passengers", {
        headers: createAuthHeaders(token),
      });
      
      const passengers = res.data?.passengers || res.data || [];
      return Array.isArray(passengers) ? passengers : [];
    };
  }, [token, userId]);

  return useApiWithFallback({
    endpoint,
    fallbackData: fallbackPassengers,
  });
};

// Standard service functions for passenger operations
export const passengerService = {
  // Add a new passenger
  async addPassenger(passengerData) {
    const token = useAuthStore.getState().token;
    const res = await axiosClient.post("/profile/passengers", passengerData, {
      headers: createAuthHeaders(token),
    });
    return res.data?.passenger || res.data;
  },

  // Update existing passenger
  async updatePassenger(passengerId, passengerData) {
    const token = useAuthStore.getState().token;
    const res = await axiosClient.patch(`/profile/passengers/${passengerId}`, passengerData, {
      headers: createAuthHeaders(token),
    });
    return res.data?.passenger || res.data;
  },

  // Delete passenger
  async deletePassenger(passengerId) {
    const token = useAuthStore.getState().token;
    const res = await axiosClient.delete(`/profile/passengers/${passengerId}`, {
      headers: createAuthHeaders(token),
    });
    return res.data?.passenger || res.data;
  },
};

// Legacy exports for backward compatibility
export async function getSavedPassengers() {
  const token = useAuthStore.getState().token;
  const res = await axiosClient.get("/profile/passengers", {
    headers: createAuthHeaders(token),
  });
  return res.data?.passengers || res.data || [];
}

export async function addPassenger(passengerData) {
  return passengerService.addPassenger(passengerData);
}

export async function updatePassenger(passengerId, passengerData) {
  return passengerService.updatePassenger(passengerId, passengerData);
}

export async function deletePassenger(passengerId) {
  return passengerService.deletePassenger(passengerId);
}

export { fallbackPassengers };

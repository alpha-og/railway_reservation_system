import client from "../../../../services/config/axiosClient.js";
import { useAuthStore } from "../../../../store/useAuthStore";
import { useApiWithFallback } from "../../../../services/useApiWithFallback";
import { useUserId } from "../../../../hooks/useUserId";
import { useMemo } from "react";

// Fallback data for when API is not available
const fallbackPassengers = [
  { id: "1", name: "Alice Johnson", age: 28, gender: "Female", email: "alice@example.com" },
  { id: "2", name: "Bob Smith", age: 35, gender: "Male", email: "bob@example.com" },
  { id: "3", name: "Charlie Brown", age: 22, gender: "Male", email: "charlie@example.com" },
];

const createAuthHeaders = (token) =>
  token ? { Authorization: `Bearer ${token}` } : {};

// API functions
async function getPassengers() {
  const token = useAuthStore.getState().token;
  const response = await client.get("/profile/passengers", {
    headers: createAuthHeaders(token),
  });
  return response.data.data.passengers;
}

async function addPassenger(passengerData) {
  const token = useAuthStore.getState().token;
  const response = await client.post("/profile/passengers", passengerData, {
    headers: createAuthHeaders(token),
  });
  return response.data.data.passenger;
}

async function updatePassenger(passengerId, passengerData) {
  const token = useAuthStore.getState().token;
  const response = await client.patch(`/profile/passengers/${passengerId}`, passengerData, {
    headers: createAuthHeaders(token),
  });
  return response.data.data.passenger;
}

async function deletePassenger(passengerId) {
  const token = useAuthStore.getState().token;
  const response = await client.delete(`/profile/passengers/${passengerId}`, {
    headers: createAuthHeaders(token),
  });
  return response.data.data.passenger;
}

// Hook: Get saved passengers for current user
export const useGetSavedPassengers = () => {
  const userId = useUserId();

  const endpoint = useMemo(() => {
    return userId ? getPassengers : () => fallbackPassengers;
  }, [userId]);

  return useApiWithFallback({
    endpoint,
  });
};

// Service object for passenger operations
const passengerService = {
  getPassengers,
  addPassenger,
  updatePassenger,
  deletePassenger,
  fallbackPassengers,
};

export default passengerService;
